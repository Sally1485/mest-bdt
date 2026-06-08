import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { jwtVerify } from 'jose';

jest.mock('jose', () => ({
  createRemoteJWKSet: jest.fn(),
  jwtVerify: jest.fn(),
}));

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    process.env.HANKO_API_URL = 'http://test.com';
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      'Authentication required. Please sign in to continue.',
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid-token',
          },
        }),
      }),
    } as ExecutionContext;

    (jwtVerify as jest.Mock).mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      'Authentication required. Please sign in to continue.',
    );
  });

  it('should return true and set user on request if token is valid', async () => {
    const mockRequest = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const mockPayload = { sub: 'user-id' };
    (jwtVerify as jest.Mock).mockResolvedValue({ payload: mockPayload });

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest['user']).toEqual(mockPayload);
  });
});
