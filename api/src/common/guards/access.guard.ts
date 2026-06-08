import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Response as ResponseEntity } from '../../responses/schemas/response.schema';

const ROLE_FORBIDDEN_MESSAGE =
  'Read-only members cannot submit or modify form responses.';
const TENANT_FORBIDDEN_MESSAGE =
  'You do not have access to responses outside your company.';

type ResponsesRoute = 'collection' | 'count' | 'item';

/**
 * Enforces role-based and tenant-isolated access on the `/responses`
 * endpoints. Must run after `AuthGuard` so `request.user` carries the
 * verified Hanko payload.
 *
 * - Looks up the API User by the authenticated email.
 * - POST: requires WRITE access and `body.company === user.company`.
 * - GET on the collection / count routes: forces
 *   `query.filter.company` to the user's company, overriding any
 *   client-supplied value.
 * - GET / PATCH / DELETE on `:id`: loads the response and rejects when
 *   `response.company !== user.company`. PATCH and DELETE additionally
 *   require WRITE access; PATCH also rejects body.company overrides.
 */
@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(ResponseEntity.name)
    private readonly responseModel: Model<ResponseEntity>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const hankoEmail: string | undefined = request?.user?.email?.address;
    if (!hankoEmail) {
      throw new UnauthorizedException(
        'Account is not provisioned. Accept an invitation first.',
      );
    }

    const user = await this.userModel
      .findOne({ email: hankoEmail.toLowerCase() })
      .exec();

    if (!user) {
      throw new UnauthorizedException(
        'Account is not provisioned. Accept an invitation first.',
      );
    }

    request.appUser = user;

    const userCompany = (
      user.company as unknown as Types.ObjectId | string
    ).toString();
    const method: string = String(request.method ?? '').toUpperCase();
    const route = this.classifyResponsesRoute(request);

    switch (method) {
      case 'POST': {
        this.requireWriteAccess(user);
        if (String(request.body?.company) !== userCompany) {
          throw new ForbiddenException(TENANT_FORBIDDEN_MESSAGE);
        }
        return true;
      }

      case 'GET': {
        if (route === 'collection' || route === 'count') {
          this.injectCompanyFilter(request, userCompany);
          return true;
        }
        await this.assertResponseTenant(request, userCompany);
        return true;
      }

      case 'PATCH': {
        this.requireWriteAccess(user);
        await this.assertResponseTenant(request, userCompany);
        if (
          request.body !== undefined &&
          request.body !== null &&
          Object.prototype.hasOwnProperty.call(request.body, 'company') &&
          String(request.body.company) !== userCompany
        ) {
          throw new ForbiddenException(TENANT_FORBIDDEN_MESSAGE);
        }
        return true;
      }

      case 'DELETE': {
        this.requireWriteAccess(user);
        await this.assertResponseTenant(request, userCompany);
        return true;
      }

      default:
        return true;
    }
  }

  private requireWriteAccess(user: UserDocument): void {
    if (user.access !== 'WRITE') {
      throw new ForbiddenException(ROLE_FORBIDDEN_MESSAGE);
    }
  }

  /**
   * Classify the request as targeting `/responses`, `/responses/count`, or
   * `/responses/:id`. Looks at the trailing segments after the literal
   * `responses` segment so it works under mount prefixes and trailing
   * slashes.
   */
  private classifyResponsesRoute(request: {
    path?: string;
    url?: string;
    originalUrl?: string;
  }): ResponsesRoute {
    const rawPath: string =
      request.path ?? request.originalUrl ?? request.url ?? '';
    const pathOnly = rawPath.split('?')[0];
    const segments = pathOnly.split('/').filter((s) => s.length > 0);
    const responsesIndex = segments.lastIndexOf('responses');
    const tail = responsesIndex >= 0 ? segments.slice(responsesIndex + 1) : [];

    if (tail.length === 0) {
      return 'collection';
    }
    if (tail.length === 1 && tail[0] === 'count') {
      return 'count';
    }
    return 'item';
  }

  /**
   * Mutate `request.query.filter` so the controller's `JSON.parse(filter)`
   * sees `company` scoped to the authenticated user's company.
   */
  private injectCompanyFilter(
    request: { query?: Record<string, unknown> },
    userCompany: string,
  ): void {
    if (!request.query || typeof request.query !== 'object') {
      request.query = {};
    }
    const rawFilter = request.query.filter;
    let parsed: Record<string, unknown> = {};
    if (typeof rawFilter === 'string' && rawFilter.length > 0) {
      try {
        const candidate = JSON.parse(rawFilter);
        if (
          candidate &&
          typeof candidate === 'object' &&
          !Array.isArray(candidate)
        ) {
          parsed = candidate as Record<string, unknown>;
        }
      } catch {
        // Fall through to an empty filter; the controller will surface any
        // downstream JSON parse errors. Tenant scoping must still apply.
        parsed = {};
      }
    }
    parsed.company = userCompany;
    request.query.filter = JSON.stringify(parsed);
  }

  /**
   * Look up the response targeted by `:id` and reject when its `company`
   * differs from the authenticated user's company. A missing response is
   * allowed through so the controller can return its standard 404.
   */
  private async assertResponseTenant(
    request: { params?: Record<string, string> },
    userCompany: string,
  ): Promise<void> {
    const id = request.params?.id;
    if (!id) {
      return;
    }
    const response = await this.responseModel.findOne({ _id: id }).exec();
    if (
      response &&
      (response.company as unknown as Types.ObjectId | string).toString() !==
        userCompany
    ) {
      throw new ForbiddenException(TENANT_FORBIDDEN_MESSAGE);
    }
  }
}
