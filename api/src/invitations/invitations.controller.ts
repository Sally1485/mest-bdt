import {
  BadGatewayException,
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiGoneResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { Model } from 'mongoose';

import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser, HankoUser } from '../common/decorators/user.decorator';
import { Company } from '../companies/schemas/company.schema';
import { User } from '../users/schemas/user.schema';
import { EmailService } from '../email/email.service';

import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { ListInvitationsQueryDto } from './dto/list-invitations.query.dto';
import { VerifyInvitationQueryDto } from './dto/verify-invitation.query.dto';
import { Invitation } from './schemas/invitation.schema';
import { InvitationsService } from './invitations.service';

/**
 * HTTP surface for company invitations.
 *
 * Route order matters: NestJS uses Express, which matches in declaration
 * order. Literal paths `/verify` and `/count` must be declared before
 * `/:id` so they aren't captured by the parameterised handler:
 *
 *   1. POST   /invitations          — create or refresh
 *   2. GET    /invitations/verify   — public
 *   3. GET    /invitations/count
 *   4. GET    /invitations          — list
 *   5. GET    /invitations/:id
 *   6. DELETE /invitations/:id      — revoke
 *   7. POST   /invitations/accept   — consume token, provision User
 *
 * `AuthGuard` is applied per-route rather than at the class level so
 * `GET /invitations/verify` can stay public without introducing a
 * `@Public()` decorator (this codebase does not have one).
 *
 * `tokenHash` and the raw token never leave this controller. The service
 * projects `tokenHash` out, the schema's `toJSON` strips it, and the raw
 * `rawToken` returned by `service.createOrRefresh` is consumed only by
 * `EmailService.sendInvitation`.
 */
@ApiTags('invitations')
@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
@Controller('invitations')
export class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsService,
    private readonly emailService: EmailService,
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // ------------------------------------------------------------------- //
  // 1. POST /invitations  — create or refresh                            //
  // ------------------------------------------------------------------- //
  /**
   * Create a PENDING invitation for `(email, company)` or refresh the
   * existing PENDING invitation in place.
   *
   * - Validate the Company exists; otherwise 404 "Company not found."
   * - Reject if a User already exists with this email (409).
   * - Delegate the create-or-refresh decision to the service.
   * - Send the invitation email after persistence. If delivery fails,
   *   leave the Invitation in place and surface 502; a retry of POST
   *   will re-send the email against the same row (refresh branch).
   * - Return 201 on create and 200 on refresh.
   */
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create or refresh a company invitation' })
  @ApiCreatedResponse({
    description: 'Invitation created and email dispatched.',
    type: Invitation,
  })
  @ApiOkResponse({
    description:
      'Existing PENDING invitation refreshed in place; a new email was sent.',
    type: Invitation,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiNotFoundResponse({ description: 'Company not found.' })
  @ApiConflictResponse({
    description: 'A user with this email already exists in the system.',
  })
  @ApiBadGatewayResponse({
    description:
      'Invitation persisted but the email could not be delivered. Retry safe.',
  })
  async create(
    @Body() body: CreateInvitationDto,
    @CurrentUser() inviter: HankoUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Use findById rather than exists so both "no document" and any
    // structurally invalid id (already filtered by @IsMongoId on the DTO)
    // collapse into the same 404.
    const company = await this.companyModel.findById(body.company);
    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    // Case-insensitive User lookup. `User.email` is stored as-is, so we
    // lowercase the inbound email and match against the indexed field.
    // This mirrors the duplicate-user check inside `service.accept`.
    const normalisedEmail = body.email.toLowerCase();
    const existingUserCount = await this.userModel.countDocuments({
      email: normalisedEmail,
    });
    if (existingUserCount > 0) {
      throw new ConflictException(
        'A user with this email already exists in the system.',
      );
    }

    // The service handles the create-or-refresh decision, the
    // partial-unique-index race, and the token hashing. The raw token is
    // returned only so we can pass it to EmailService — it is never
    // persisted, logged, or returned over HTTP.
    const { invitation, rawToken, refreshed } =
      await this.invitationsService.createOrRefresh({
        email: normalisedEmail,
        company: body.company,
        access: body.access,
        invitedBy: inviter.sub,
      });

    // Send the email after persistence. On failure leave the Invitation
    // intact and surface 502; the controller does not call any service
    // method that would mutate the invitation here, so a retry of POST
    // will re-send the email against the same document (refresh branch).
    try {
      await this.emailService.sendInvitation({
        to: invitation.email,
        companyName: company.name,
        access: invitation.access,
        rawToken,
        expiresAt: invitation.expiresAt,
      });
    } catch {
      throw new BadGatewayException(
        'Invitation created but email delivery failed. Please retry.',
      );
    }

    // 201 for create, 200 for refresh. Passthrough mode lets Nest still
    // serialise the returned value.
    res.status(refreshed ? HttpStatus.OK : HttpStatus.CREATED);
    return invitation;
  }

  // ------------------------------------------------------------------- //
  // 2. GET /invitations/verify  — PUBLIC                                 //
  // ------------------------------------------------------------------- //
  /**
   * Public token-verification endpoint used by the frontend accept page
   * before a Hanko sign-up flow.
   *
   * This is the only invitation route without `AuthGuard`. The handler is
   * read-only: it never mutates the Invitation, even when it discovers
   * the document is expired. Mutating here would let an unauthenticated
   * caller force a state transition by submitting a stolen-but-not-yet
   * -used token; the lazy PENDING → EXPIRED transition lives only on the
   * accept path.
   *
   * Declared before `/:id` so Express matches the literal path first.
   * The DTO's `@Matches(/^[0-9a-f]{64}$/)` rejects malformed tokens with
   * 400 before we reach the handler. Status, found, and orphan handling
   * all happen in the service.
   */
  @Get('verify')
  @ApiOperation({ summary: 'Publicly verify an invitation token' })
  @ApiOkResponse({
    description:
      'Token resolves to a still-valid PENDING invitation. Response carries email, companyName, access, expiresAt.',
  })
  @ApiBadRequestResponse({ description: 'Invalid token format.' })
  @ApiNotFoundResponse({
    description: 'Invitation not found or has already been used.',
  })
  @ApiGoneResponse({
    description: 'This invitation has expired. Please request a new one.',
  })
  verify(@Query() query: VerifyInvitationQueryDto) {
    return this.invitationsService.verify(query.token);
  }

  // ------------------------------------------------------------------- //
  // 3. GET /invitations/count                                            //
  // ------------------------------------------------------------------- //
  /**
   * Count Invitation documents matching a JSON-encoded `filter` query
   * parameter, mirroring the `/count` convention used by the other
   * controllers (`users`, `cohorts`, `companies`, etc.).
   *
   * `filter` is optional; missing or empty is treated as `{}`. Unlike
   * the sibling controllers this one wraps `JSON.parse` in try/catch and
   * surfaces a 400 with a clear message for malformed input rather than
   * letting a synchronous `SyntaxError` bubble up as a 500.
   *
   * Declared before `/:id` so Express matches the literal path first.
   */
  @UseGuards(AuthGuard)
  @Get('count')
  @ApiOperation({ summary: 'Count invitations matching a filter' })
  @ApiOkResponse({
    description: 'The count of invitations matching the filter.',
    type: Number,
  })
  @ApiBadRequestResponse({
    description: 'Filter must be a valid JSON-encoded object.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  countDocuments(@Query() { filter = '{}' }: { filter?: string }) {
    let parsed: object;
    try {
      parsed = JSON.parse(filter) as object;
    } catch {
      throw new BadRequestException(
        'Filter must be a valid JSON-encoded object.',
      );
    }
    return this.invitationsService.countDocuments(parsed);
  }

  // ------------------------------------------------------------------- //
  // 4. GET /invitations  — list                                          //
  // ------------------------------------------------------------------- //
  /**
   * List Invitations for a Company, optionally filtered by `status`.
   *
   * Required `company` query param (validated as a 24-char hex Mongo
   * ObjectId by the DTO), optional `status` (one of the four
   * `InvitationStatus` literals). The filter object only includes
   * `status` when provided so an absent value does not narrow the
   * result set.
   */
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'List invitations for a company' })
  @ApiOkResponse({
    description: 'The invitations matching the filter.',
    type: [Invitation],
  })
  @ApiBadRequestResponse({ description: 'Invalid query parameter.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  findAll(@Query() query: ListInvitationsQueryDto) {
    return this.invitationsService.findAll({
      company: query.company,
      ...(query.status && { status: query.status }),
    });
  }

  // ------------------------------------------------------------------- //
  // 5. GET /invitations/:id  — read by id                                //
  // ------------------------------------------------------------------- //
  /**
   * Read a single Invitation by id.
   *
   * `service.findById` pre-validates the id format and returns `null` for
   * malformed ids (no DB round-trip, no Mongoose CastError), as well as
   * for not-found. The controller maps both into the same 404 message,
   * keeping the error surface uniform.
   */
  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get an invitation by id' })
  @ApiOkResponse({ description: 'The invitation.', type: Invitation })
  @ApiNotFoundResponse({
    description: 'Invitation not found or has already been used.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async findById(@Param('id') id: string) {
    const invitation = await this.invitationsService.findById(id);
    if (!invitation) {
      throw new NotFoundException(
        'Invitation not found or has already been used.',
      );
    }
    return invitation;
  }

  // ------------------------------------------------------------------- //
  // 6. DELETE /invitations/:id  — revoke                                 //
  // ------------------------------------------------------------------- //
  /**
   * Revoke a PENDING invitation. 404 for unknown/malformed id, 200 with
   * the updated document on success, 409 when the invitation is not
   * PENDING. The service's predicated `updateOne` keeps the transition
   * safe under concurrent accepts.
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Revoke a pending invitation' })
  @ApiOkResponse({
    description: 'The invitation has been revoked.',
    type: Invitation,
  })
  @ApiNotFoundResponse({
    description: 'Invitation not found or has already been used.',
  })
  @ApiConflictResponse({
    description: 'Cannot revoke an invitation that is not pending.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  revoke(@Param('id') id: string) {
    return this.invitationsService.revoke(id);
  }

  // ------------------------------------------------------------------- //
  // 7. POST /invitations/accept  — consume token, provision User         //
  // ------------------------------------------------------------------- //
  /**
   * Consume an invitation token and provision the matching User.
   *
   * Reads the authenticated email from `@CurrentUser()` and forwards
   * both the raw token (validated by the DTO) and the Hanko email into
   * the service, which performs the full lifecycle check (token format,
   * hash lookup, status, expiry, email-identity match, pre-existing
   * user, User creation, status transition with compensation) and
   * returns `{ user }` on success.
   */
  @UseGuards(AuthGuard)
  @Post('accept')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Accept an invitation and provision a user' })
  @ApiCreatedResponse({
    description: 'The user has been provisioned for the invitation.',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Invalid token format.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({
    description:
      'This invitation was issued to a different email address. Sign in with the invited account.',
  })
  @ApiNotFoundResponse({
    description: 'Invitation not found or has already been used.',
  })
  @ApiConflictResponse({
    description: 'A user with this email already exists in the system.',
  })
  @ApiGoneResponse({
    description: 'This invitation has expired. Please request a new one.',
  })
  async accept(
    @Body() body: AcceptInvitationDto,
    @CurrentUser() user: HankoUser,
  ) {
    const result = await this.invitationsService.accept({
      token: body.token,
      hankoEmail: user.email.address,
    });
    return result.user;
  }
}
