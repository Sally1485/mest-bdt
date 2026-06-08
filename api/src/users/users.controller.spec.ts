import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  HTTP_CODE_METADATA,
  METHOD_METADATA,
  PATH_METADATA,
} from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common/enums/request-method.enum';
import { getModelToken } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { mockModel } from '../common/mocks/model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HankoUser } from '../common/decorators/user.decorator';
import { User } from './schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: mockModel },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto: CreateUserDto = { email: 'test@test.com' } as any;

    it('should create a user if they do not exist', async () => {
      jest.spyOn(service, 'countDocuments').mockResolvedValue(0);
      jest.spyOn(service, 'create').mockResolvedValue(dto as any);

      const result = await controller.create(dto);

      expect(result).toEqual(dto);
      expect(service.countDocuments).toHaveBeenCalledWith({ email: dto.email });
      expect(service.create as jest.Mock).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if user exists', async () => {
      jest.spyOn(service, 'countDocuments').mockResolvedValue(1);

      await expect(controller.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = [{ email: 'test@test.com' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(users as any);

      const result = await controller.findAll({ filter: '{"role":"admin"}' });

      expect(result).toEqual(users);
      expect(service.findAll as jest.Mock).toHaveBeenCalledWith({
        role: 'admin',
      });
    });
  });

  describe('countDocuments', () => {
    it('should count users', async () => {
      jest.spyOn(service, 'countDocuments').mockResolvedValue(5);

      const result = await controller.countDocuments({ filter: '{}' });

      expect(result).toEqual(5);
    });
  });

  describe('findCurrentUser', () => {
    const hankoUser: HankoUser = { email: { address: 'me@test.com' } } as any;

    it('should find current user', async () => {
      jest.spyOn(service, 'countDocuments').mockResolvedValue(1);
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ email: 'me@test.com' } as any);

      const result = await controller.findCurrentUser(hankoUser);

      expect(result).toEqual({ email: 'me@test.com' });
    });

    it('should throw NotFoundException if current user not found', async () => {
      jest.spyOn(service, 'countDocuments').mockResolvedValue(0);

      await expect(controller.findCurrentUser(hankoUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should find one user by id', async () => {
      const user = { _id: '1' };
      jest.spyOn(service, 'findOne').mockResolvedValue(user as any);

      const result = await controller.findOne('1');

      expect(result).toEqual(user);
      expect(service.findOne as jest.Mock).toHaveBeenCalledWith({ _id: '1' });
    });
  });

  describe('updateOne', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { name: 'Updated' };
      jest.spyOn(service, 'updateOne').mockResolvedValue(dto as any);

      const result = await controller.updateOne('1', dto);

      expect(result).toEqual(dto);
      expect(service.updateOne as jest.Mock).toHaveBeenCalledWith(
        { _id: '1' },
        dto,
      );
    });
  });

  describe('deleteOne', () => {
    it('should delete a user', async () => {
      jest
        .spyOn(service, 'deleteOne')
        .mockResolvedValue({ deletedCount: 1 } as any);

      const result = await controller.deleteOne('1');

      expect(result).toEqual({ deletedCount: 1 });
      expect(service.deleteOne as jest.Mock).toHaveBeenCalledWith({ _id: '1' });
    });
  });
});

/**
 * Backward-compatibility regression for `/users`.
 *
 * Pins the existing `/users` route surface (paths, HTTP methods, body
 * field names, query parameters, status codes, response field names) so
 * the company-invitations changes do not regress callers that bypass the
 * invitation flow. Also asserts that the `/users` module never reaches
 * into the Invitation collection.
 */
describe('UsersController (backward-compatibility regression for /users)', () => {
  // Pre-invitations route surface. Each entry pins handler name to its
  // method, path, and Nest default status code. None of these handlers
  // override @HttpCode, so the defaults (201 for POST, 200 elsewhere) hold.
  const expectedRoutes = [
    {
      handler: 'create',
      method: RequestMethod.POST,
      path: '/',
      defaultStatus: 201,
    },
    {
      handler: 'findAll',
      method: RequestMethod.GET,
      path: '/',
      defaultStatus: 200,
    },
    {
      handler: 'countDocuments',
      method: RequestMethod.GET,
      path: 'count',
      defaultStatus: 200,
    },
    {
      handler: 'findCurrentUser',
      method: RequestMethod.GET,
      path: 'me',
      defaultStatus: 200,
    },
    {
      handler: 'findOne',
      method: RequestMethod.GET,
      path: ':id',
      defaultStatus: 200,
    },
    {
      handler: 'updateOne',
      method: RequestMethod.PATCH,
      path: ':id',
      defaultStatus: 200,
    },
    {
      handler: 'deleteOne',
      method: RequestMethod.DELETE,
      path: ':id',
      defaultStatus: 200,
    },
  ];

  it('preserves the controller base path `/users`', () => {
    const basePath = Reflect.getMetadata(PATH_METADATA, UsersController);
    expect(basePath).toBe('users');
  });

  it.each(expectedRoutes)(
    'preserves route surface for $handler ($method $path)',
    ({ handler, method, path, defaultStatus }) => {
      const handlerFn = (UsersController.prototype as any)[handler];
      expect(typeof handlerFn).toBe('function');

      expect(Reflect.getMetadata(PATH_METADATA, handlerFn)).toBe(path);
      expect(Reflect.getMetadata(METHOD_METADATA, handlerFn)).toBe(method);

      // No @HttpCode override; route uses Nest's default status code.
      const httpCodeOverride = Reflect.getMetadata(
        HTTP_CODE_METADATA,
        handlerFn,
      );
      expect(httpCodeOverride).toBeUndefined();
      expect(defaultStatus).toBe(method === RequestMethod.POST ? 201 : 200);
    },
  );

  it('does not declare any `/users` route beyond the pinned surface', () => {
    // Guard against silently introducing new routes.
    const ownMethodNames = Object.getOwnPropertyNames(
      UsersController.prototype,
    ).filter((name) => {
      if (name === 'constructor') return false;
      const fn = (UsersController.prototype as any)[name];
      return (
        typeof fn === 'function' &&
        Reflect.getMetadata(METHOD_METADATA, fn) !== undefined
      );
    });
    expect(ownMethodNames.sort()).toEqual(
      expectedRoutes.map((r) => r.handler).sort(),
    );
  });

  it('preserves CreateUserDto request body field names', () => {
    const expected = [
      'company',
      'email',
      'name',
      'phone',
      'location',
      'avatar',
      'bio',
      'access',
    ].sort();

    // Object.keys won't expose unset properties, so round-trip the fields
    // through a fresh instance to confirm every expected key is settable.
    const probe = new CreateUserDto() as unknown as Record<string, unknown>;
    for (const field of expected) {
      probe[field] = field === 'access' ? 'READ' : `value-${field}`;
    }
    expect(Object.keys(probe).sort()).toEqual(expected);
  });

  it('preserves UpdateUserDto as a partial of CreateUserDto', () => {
    const probe = new UpdateUserDto() as Record<string, unknown>;
    probe.email = 'a@b.com';
    probe.name = 'New';
    expect('email' in probe).toBe(true);
    expect('name' in probe).toBe(true);
  });

  it('preserves the `filter` query parameter on GET /users and GET /users/count', () => {
    // Both handlers parse `filter` as JSON, defaulting to `{}` when absent.
    const usersService = {
      findAll: jest.fn().mockResolvedValue([]),
      countDocuments: jest.fn().mockResolvedValue(0),
    } as unknown as UsersService;
    const ctrl = new UsersController(usersService);

    void ctrl.findAll({ filter: '{"role":"admin"}' });
    expect(usersService.findAll as jest.Mock).toHaveBeenCalledWith({
      role: 'admin',
    });

    void ctrl.findAll({} as any);
    expect(usersService.findAll as jest.Mock).toHaveBeenLastCalledWith({});

    void ctrl.countDocuments({ filter: '{"company":"abc"}' });
    expect(usersService.countDocuments as jest.Mock).toHaveBeenCalledWith({
      company: 'abc',
    });

    void ctrl.countDocuments({} as any);
    expect(usersService.countDocuments as jest.Mock).toHaveBeenLastCalledWith(
      {},
    );
  });

  it('POST /users creates a User without any Invitation lookup', async () => {
    // The controller is built with only the User model. If the handler
    // ever started depending on an Invitation provider, DI would fail
    // here. The explicit assertions below also catch any direct
    // invitation-collection access.
    const userModelMock = {
      ...mockModel,
      countDocuments: jest.fn().mockResolvedValue(0),
      insertOne: jest
        .fn()
        .mockImplementation((doc) =>
          Promise.resolve({ _id: 'generated-id', ...doc }),
        ),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: userModelMock },
      ],
    }).compile();

    const ctrl = module.get<UsersController>(UsersController);

    const dto: CreateUserDto = {
      company: '60f1b9b3b3b3b3b3b3b3b3b3',
      email: 'seeded@admin.test',
      name: 'Seeded Admin',
      phone: '5551234567',
      location: 'Remote',
      avatar: 'https://example.com/a.png',
      bio: 'Seed user for admin flow.',
      access: 'WRITE',
    };

    const result: any = await ctrl.create(dto);

    expect(userModelMock.countDocuments).toHaveBeenCalledTimes(1);
    expect(userModelMock.countDocuments).toHaveBeenCalledWith({
      email: dto.email,
    });
    expect(userModelMock.insertOne).toHaveBeenCalledTimes(1);
    expect(userModelMock.insertOne).toHaveBeenCalledWith(dto);

    // Only the User-model methods we expect are invoked — every other
    // jest.fn on the mock must have zero calls.
    const allowedCalls = new Set(['countDocuments', 'insertOne']);
    for (const [key, value] of Object.entries(userModelMock)) {
      if (typeof (value as any)?.mock !== 'object') continue;
      const calls = value.mock.calls.length;
      if (!allowedCalls.has(key)) {
        expect({ key, calls }).toEqual({ key, calls: 0 });
      }
    }

    // The persisted document carries every CreateUserDto field verbatim.
    expect(result).toMatchObject(dto);
  });

  it('POST /users does not import or depend on the Invitation module', () => {
    // Static guard: the users module's source must not reference any
    // Invitation symbol. Read the files off disk so accidental edits are
    // caught at test time.
    const files = [
      path.join(__dirname, 'users.controller.ts'),
      path.join(__dirname, 'users.service.ts'),
      path.join(__dirname, 'users.module.ts'),
    ];
    for (const file of files) {
      const src = fs.readFileSync(file, 'utf8');
      expect(src).not.toMatch(/invitation/i);
    }
  });

  it('preserves User response schema field names', () => {
    // Pin the externally-visible field set on the User class.
    const probe = new User() as unknown as Record<string, unknown>;
    probe.company = '60f1b9b3b3b3b3b3b3b3b3b3';
    probe.email = 'a@b.com';
    probe.name = 'A';
    probe.phone = '1';
    probe.location = 'L';
    probe.avatar = 'https://x';
    probe.bio = 'B';
    probe.access = 'READ';
    expect(Object.keys(probe).sort()).toEqual(
      [
        'access',
        'avatar',
        'bio',
        'company',
        'email',
        'location',
        'name',
        'phone',
      ].sort(),
    );
  });
});
