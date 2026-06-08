import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const JWKS = createRemoteJWKSet(
      new URL(`${process.env.HANKO_API_URL}/.well-known/jwks.json`),
    );
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request as Request);
    // console.log(token);
    if (!token) {
      throw new UnauthorizedException(
        'Authentication required. Please sign in to continue.',
      );
    }
    try {
      const result = await jwtVerify(token, JWKS);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // console.log(result);
      request['user'] = result.payload;
    } catch {
      throw new UnauthorizedException(
        'Authentication required. Please sign in to continue.',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request?.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
