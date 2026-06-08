import * as crypto from 'crypto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import {
  Invitation,
  InvitationDocument,
  InvitationStatus,
} from './schemas/invitation.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Company } from '../companies/schemas/company.schema';

// 24-character hex string — the canonical Mongo ObjectId wire format.
// Used by `findById` to short-circuit malformed ids to `null` (so the
// controller can map them to 404) without touching the DB or triggering
// Mongoose's CastError surface.
const OBJECT_ID_HEX_REGEX = /^[0-9a-fA-F]{24}$/;

export interface CreateOrRefreshArgs {
  /** Raw email address; lowercased before persistence. */
  email: string;
  /** 24-char hex Mongo ObjectId of the target Company. */
  company: string;
  access: 'READ' | 'WRITE';
  /** Optional Hanko `sub` of the inviter. */
  invitedBy?: string;
}

export interface CreateOrRefreshResult {
  invitation: InvitationDocument;
  /** Raw 64-char hex token used to build the accept link. Never persisted. */
  rawToken: string;
  /** True when an existing PENDING invitation was updated in place. */
  refreshed: boolean;
}

export interface AcceptArgs {
  /** Raw token submitted by the invitee (must match `^[0-9a-f]{64}$`). */
  token: string;
  /** `HankoUser.email.address` from the verified Hanko Bearer JWT. */
  hankoEmail: string;
}

export interface AcceptResult {
  user: UserDocument;
}

/**
 * Structural check for MongoDB duplicate-key errors (E11000). Inspecting
 * `code` rather than the error class lets this work across driver
 * versions and also lets unit tests stub the model with plain
 * `{ code: 11000 }` errors.
 */
function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === 11000
  );
}

@Injectable()
export class InvitationsService {
  /** 3 days = 259,200,000 ms. Every issued/refreshed Invitation gets this TTL. */
  private readonly TOKEN_TTL_MS = 3 * 24 * 60 * 60 * 1000;

  constructor(
    @InjectModel(Invitation.name)
    private invitationModel: Model<Invitation>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  /** 256-bit token encoded as 64 lowercase hex chars. */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /** SHA-256 hex digest of a raw token. Only the digest is persisted. */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Constant-time equality of two SHA-256 hex digests. `timingSafeEqual`
   * requires equal-length buffers, so we pre-check lengths to avoid a
   * synchronous throw on malformed inputs (which would itself leak
   * timing information).
   */
  private compareTokenHashes(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  }

  /**
   * Create a new PENDING Invitation, or refresh the existing PENDING one
   * for `(email, company)` in place.
   *
   * Email is lowercased before any DB lookup. If a PENDING invitation
   * already exists for `(email, company)`, this method rotates its
   * `tokenHash`, `expiresAt`, and `invitedBy` and keeps `status` as
   * PENDING; the document `_id` is preserved (it is a refresh, not a
   * status transition).
   *
   * Otherwise a new PENDING invitation is inserted with `expiresAt = now
   * + TOKEN_TTL_MS`. If the insert races against a concurrent insert and
   * trips the partial unique `(email, company)` index, this method
   * retries once by re-reading the existing PENDING and falling into the
   * refresh branch — so the race surfaces as a deterministic refresh
   * instead of a 500.
   *
   * The raw token is returned to the caller for the email body. It is
   * never persisted or logged; only the SHA-256 digest is stored.
   */
  async createOrRefresh({
    email,
    company,
    access,
    invitedBy,
  }: CreateOrRefreshArgs): Promise<CreateOrRefreshResult> {
    const normalisedEmail = email.toLowerCase();

    const existingPending = await this.invitationModel.findOne({
      email: normalisedEmail,
      company: company as unknown as Company,
      status: 'PENDING',
    });

    if (existingPending) {
      return this.refreshExistingPending(existingPending, invitedBy);
    }

    const rawToken = this.generateToken();
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + this.TOKEN_TTL_MS);

    try {
      const invitation = await this.invitationModel.insertOne({
        email: normalisedEmail,
        company: company as unknown as Company,
        access,
        status: 'PENDING',
        tokenHash,
        expiresAt,
        invitedBy,
      });
      return { invitation, rawToken, refreshed: false };
    } catch (err) {
      // Race condition: another request inserted the PENDING row between
      // our findOne and insertOne. Retry once by re-reading and refreshing.
      if (!isDuplicateKeyError(err)) {
        throw err;
      }

      const racedPending = await this.invitationModel.findOne({
        email: normalisedEmail,
        company: company as unknown as Company,
        status: 'PENDING',
      });
      if (!racedPending) {
        // Duplicate key on `tokenHash` (astronomically unlikely) or on a
        // stale terminal-state document — neither is recoverable here.
        // Surface the original error so callers see a 500.
        throw err;
      }
      return this.refreshExistingPending(racedPending, invitedBy);
    }
  }

  /**
   * Rotate `tokenHash`, `expiresAt`, and `invitedBy` on an existing
   * PENDING invitation in place. Status stays PENDING — refresh is not a
   * transition.
   *
   * The `updateOne` filter pins `status: 'PENDING'` so a concurrent
   * revoke or accept cannot be clobbered: if the document has left
   * PENDING since we read it, `matchedCount` is 0 and the re-read
   * returns the latest snapshot to the caller.
   */
  private async refreshExistingPending(
    existing: InvitationDocument,
    invitedBy: string | undefined,
  ): Promise<CreateOrRefreshResult> {
    const rawToken = this.generateToken();
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + this.TOKEN_TTL_MS);

    await this.invitationModel.updateOne(
      { _id: existing._id, status: 'PENDING' },
      { tokenHash, expiresAt, invitedBy },
    );

    const updated = await this.invitationModel.findById(existing._id);
    // Should always be non-null since we just observed the document, but
    // guard against a concurrent hard-delete to keep the return type honest.
    if (!updated) {
      throw new Error(
        'Invitation disappeared between refresh update and re-read',
      );
    }
    return { invitation: updated, rawToken, refreshed: true };
  }

  /**
   * List Invitations matching `filter` with `tokenHash` projected out.
   *
   * The schema's `toJSON` transform already strips `tokenHash`, but
   * `.select('-tokenHash')` ensures the digest never reaches callers
   * that bypass `toJSON` (`.lean()`, raw aggregation, tests reading the
   * raw document). Mongoose's `find` returns `[]` for an empty match,
   * which the controller passes through unchanged.
   *
   * The `filter` parameter is widened to `QueryFilter<Invitation>`
   * internally so Mongoose can apply schema casting (e.g. coerce
   * `company` to ObjectId).
   */
  findAll(filter: {
    company: string;
    status?: InvitationStatus;
  }): Promise<InvitationDocument[]> {
    return this.invitationModel
      .find(filter as QueryFilter<Invitation>)
      .select('-tokenHash')
      .exec();
  }

  /**
   * Count Invitations matching `filter`. Backs `GET /invitations/count`,
   * which accepts a JSON-encoded filter parsed in the controller.
   * No projection needed — the result is an integer count.
   */
  countDocuments(filter: object): Promise<number> {
    return this.invitationModel
      .countDocuments(filter as QueryFilter<Invitation>)
      .exec();
  }

  /**
   * Find a single Invitation matching `filter`, with `tokenHash` projected
   * out. Returns `null` when nothing matches; callers map that to 404.
   * `findById` adds ObjectId-format pre-validation on top of this.
   */
  findOne(filter: object): Promise<InvitationDocument | null> {
    return this.invitationModel
      .findOne(filter as QueryFilter<Invitation>)
      .select('-tokenHash')
      .exec();
  }

  /**
   * Find an Invitation by string `id`, with `tokenHash` projected out.
   *
   * Pre-validates the id format so a malformed `:id` short-circuits to
   * `null` (no DB round-trip, no Mongoose CastError). The controller
   * translates `null` into the 404 response. On a well-formed id the
   * behaviour matches `findOne`.
   */
  findById(id: string): Promise<InvitationDocument | null> {
    if (typeof id !== 'string' || !OBJECT_ID_HEX_REGEX.test(id)) {
      return Promise.resolve(null);
    }
    return this.invitationModel.findById(id).select('-tokenHash').exec();
  }

  /**
   * Transition a PENDING Invitation to REVOKED.
   *
   * - Malformed id or no Invitation found → 404 "Invitation not found
   *   or has already been used." (`findById` handles both cases).
   * - Status not PENDING (already REVOKED, ACCEPTED, or EXPIRED) → 409.
   * - Otherwise: `updateOne({ _id, status: 'PENDING' }, { status:
   *   'REVOKED' })`. The `status: 'PENDING'` predicate is what keeps a
   *   concurrent accept from being clobbered; if the predicate misses,
   *   we leave the terminal state alone and return the latest snapshot.
   * - The refreshed document is re-read with `tokenHash` projected out.
   */
  async revoke(id: string): Promise<InvitationDocument> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundException(
        'Invitation not found or has already been used.',
      );
    }

    if (existing.status !== 'PENDING') {
      throw new ConflictException(
        'Cannot revoke an invitation that is not pending.',
      );
    }

    await this.invitationModel.updateOne(
      { _id: id, status: 'PENDING' },
      { status: 'REVOKED' },
    );

    const refreshed = await this.invitationModel
      .findById(id)
      .select('-tokenHash')
      .exec();

    // A concurrent hard-delete between the predicated update and the
    // re-read would leave us with `null`; map it to the same 404.
    if (!refreshed) {
      throw new NotFoundException(
        'Invitation not found or has already been used.',
      );
    }

    return refreshed;
  }

  /**
   * Resolve `{ email, companyName, access, expiresAt }` for an invitation
   * given its raw token, without mutating any document.
   *
   * - Token format is checked against `^[0-9a-f]{64}$` before any DB
   *   work; a bad format throws `BadRequestException('Invalid token
   *   format.')` and skips the lookup, so callers cannot probe DB
   *   latency by submitting malformed tokens.
   * - The submitted token is hashed and looked up by `tokenHash`. The
   *   lookup is then re-checked with `compareTokenHashes` so every
   *   token comparison goes through `timingSafeEqual` even when the
   *   unique index has already narrowed to one row.
   * - Unknown token, ACCEPTED status, REVOKED status, and a missing
   *   referenced Company all collapse into the same 404 so callers
   *   cannot enumerate token state.
   * - EXPIRED status, and PENDING with `expiresAt <= now`, both throw
   *   `GoneException('This invitation has expired. Please request a
   *   new one.')`. No write is issued — verify is read-only, so it is
   *   safe to invoke unauthenticated. The lazy PENDING → EXPIRED
   *   transition only runs on the accept path.
   * - Happy path returns exactly the four keys above. `expiresAt` is
   *   serialised via `toISOString()` for a stable UTC representation.
   */
  async verify(token: string): Promise<{
    email: string;
    companyName: string;
    access: string;
    expiresAt: string;
  }> {
    if (typeof token !== 'string' || !/^[0-9a-f]{64}$/.test(token)) {
      throw new BadRequestException('Invalid token format.');
    }

    const tokenHash = this.hashToken(token);
    const invitation = await this.invitationModel.findOne({ tokenHash });

    // Constant-time re-check of the digest match so every token compare
    // funnels through `timingSafeEqual` rather than `===`.
    if (
      !invitation ||
      !this.compareTokenHashes(invitation.tokenHash, tokenHash)
    ) {
      throw new NotFoundException(
        'Invitation not found or has already been used.',
      );
    }

    if (invitation.status === 'ACCEPTED' || invitation.status === 'REVOKED') {
      throw new NotFoundException(
        'Invitation not found or has already been used.',
      );
    }

    const now = new Date();

    if (invitation.status === 'EXPIRED') {
      throw new GoneException(
        'This invitation has expired. Please request a new one.',
      );
    }

    if (
      invitation.status === 'PENDING' &&
      invitation.expiresAt.getTime() <= now.getTime()
    ) {
      throw new GoneException(
        'This invitation has expired. Please request a new one.',
      );
    }

    // PENDING and not expired — resolve the company name. A missing
    // referenced Company collapses into the same 404 as the other
    // not-found cases.
    const company = await this.companyModel.findById(invitation.company);
    if (!company) {
      throw new NotFoundException(
        'Invitation not found or has already been used.',
      );
    }

    return {
      email: invitation.email,
      companyName: company.name,
      access: invitation.access,
      expiresAt: invitation.expiresAt.toISOString(),
    };
  }

  /**
   * Consume an invitation: provision a `User` document with
   * `(email, company, access)` and transition the Invitation from
   * PENDING to ACCEPTED.
   *
   * - Token format check runs here as well as in the controller's DTO,
   *   so direct service callers can't bypass it.
   * - Token hash lookup followed by a constant-time digest re-check.
   * - Unknown token, ACCEPTED, REVOKED, or a missing referenced Company
   *   all collapse into the same 404 message.
   * - EXPIRED throws 410 with no write. PENDING with `expiresAt <= now`
   *   performs a single best-effort `updateOne({ _id, status:
   *   'PENDING' }, { status: 'EXPIRED' })` and then throws 410. Any
   *   failure of that side-effect update is swallowed so the 410
   *   response is identical regardless of whether the lazy-expire
   *   write succeeded.
   * - Email-identity check: the Hanko-verified email must equal the
   *   Invitation's email under case-insensitive comparison.
   * - If a User with that email already exists → 409. The Invitation
   *   is left untouched on this path.
   * - User creation writes exactly `email`, `company`, `access`. Other
   *   profile fields are left absent.
   * - The status transition `updateOne({ _id, status: 'PENDING' }, {
   *   status: 'ACCEPTED', acceptedAt })` is predicated on PENDING. If
   *   the predicate misses (matchedCount === 0) or the update throws,
   *   we delete the just-created User to avoid an orphan and surface
   *   500.
   */
  async accept({ token, hankoEmail }: AcceptArgs): Promise<AcceptResult> {
    if (typeof token !== 'string' || !/^[0-9a-f]{64}$/.test(token)) {
      throw new BadRequestException('Invalid token format.');
    }

    const tokenHash = this.hashToken(token);
    const invitation = await this.invitationModel.findOne({ tokenHash });

    // Constant-time digest re-check. The unique-index lookup already
    // narrowed to one row, but every token compare goes through
    // `timingSafeEqual` to keep the timing-channel guarantee uniform.
    if (
      !invitation ||
      !this.compareTokenHashes(invitation.tokenHash, tokenHash)
    ) {
      throw new NotFoundException(
        'Invitation not found or has already been used.',
      );
    }

    if (invitation.status === 'ACCEPTED' || invitation.status === 'REVOKED') {
      throw new NotFoundException(
        'Invitation not found or has already been used.',
      );
    }

    // Orphan-Company guard. Grouped with the other 404s so a stale
    // invitation referencing a deleted Company is indistinguishable
    // from "not found" to the caller.
    const company = await this.companyModel.findById(invitation.company);
    if (!company) {
      throw new NotFoundException(
        'Invitation not found or has already been used.',
      );
    }

    // EXPIRED is a terminal state — no side-effect write. The lazy
    // PENDING → EXPIRED transition below only runs when status is
    // still PENDING.
    if (invitation.status === 'EXPIRED') {
      throw new GoneException(
        'This invitation has expired. Please request a new one.',
      );
    }

    // PENDING but expired by clock: persist the lazy transition as a
    // best-effort side effect and throw 410. The catch swallows any
    // error so the 410 response does not depend on whether the
    // side-effect write succeeded.
    const now = new Date();
    if (
      invitation.status === 'PENDING' &&
      invitation.expiresAt.getTime() <= now.getTime()
    ) {
      try {
        await this.invitationModel.updateOne(
          { _id: invitation._id, status: 'PENDING' },
          { status: 'EXPIRED' },
        );
      } catch {
        // Intentionally swallowed.
      }
      throw new GoneException(
        'This invitation has expired. Please request a new one.',
      );
    }

    // Email-identity match. Both sides are lowercased so case
    // differences in the Hanko-issued address (mixed-case providers
    // sometimes preserve them) do not produce a spurious 403.
    if (hankoEmail.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new ForbiddenException(
        'This invitation was issued to a different email address. Sign in with the invited account.',
      );
    }

    // Pre-existing User check. `Invitation.email` is already canonical
    // due to `lowercase: true` in the schema, but lowercasing again
    // keeps this correct if that schema option ever changes.
    const existingUser = await this.userModel.findOne({
      email: invitation.email.toLowerCase(),
    });
    if (existingUser) {
      throw new ConflictException(
        'A user with this email already exists in the system.',
      );
    }

    // Provision the User with exactly the three fields the invitation
    // flow controls. Profile fields are left unset on purpose.
    const created = await this.userModel.create({
      email: invitation.email,
      company: invitation.company,
      access: invitation.access,
    });

    // Status transition with compensation. The `status: 'PENDING'`
    // predicate ensures we only flip a still-pending invitation, so a
    // racing revoke or another accept cannot have its terminal state
    // overwritten. If the predicate misses or the update throws, we
    // delete the just-created User to avoid an orphan and surface 500.
    let updateMatched = false;
    let updateThrew = false;
    try {
      const updateResult = await this.invitationModel.updateOne(
        { _id: invitation._id, status: 'PENDING' },
        { status: 'ACCEPTED', acceptedAt: new Date() },
      );
      updateMatched = updateResult.matchedCount > 0;
    } catch {
      updateThrew = true;
    }

    if (updateThrew || !updateMatched) {
      await this.userModel.deleteOne({ _id: created._id });
      throw new InternalServerErrorException(
        'Failed to complete invitation acceptance. Please try again.',
      );
    }

    return { user: created };
  }
}
