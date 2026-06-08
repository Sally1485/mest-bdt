import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { mockModel } from '../common/mocks/model';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: mockModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = { email: 'test@test.com' };
    mockModel.insertOne.mockResolvedValue(dto);
    const result = await service.create(dto);
    expect(result).toEqual(dto);
    expect(mockModel.insertOne).toHaveBeenCalledWith(dto);
  });

  it('should count users', async () => {
    mockModel.countDocuments.mockResolvedValue(10);
    const result = await service.countDocuments({});
    expect(result).toEqual(10);
    expect(mockModel.countDocuments).toHaveBeenCalledWith({});
  });

  it('should find all users', async () => {
    const users = [{ email: 'test@test.com' }];
    mockModel.find.mockResolvedValue(users);
    const result = await service.findAll({});
    expect(result).toEqual(users);
    expect(mockModel.find).toHaveBeenCalledWith({});
  });

  it('should find one user', async () => {
    const user = { email: 'test@test.com' };
    mockModel.findOne.mockResolvedValue(user);
    const result = await service.findOne({ _id: '1' });
    expect(result).toEqual(user);
    expect(mockModel.findOne).toHaveBeenCalledWith({ _id: '1' });
  });

  it('should update a user', async () => {
    const user = { email: 'Updated' };
    mockModel.updateOne.mockResolvedValue(user);
    const result = await service.updateOne({ _id: '1' }, user);
    expect(result).toEqual(user);
    expect(mockModel.updateOne).toHaveBeenCalledWith({ _id: '1' }, user);
  });

  it('should delete a user', async () => {
    mockModel.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const result = await service.deleteOne({ _id: '1' });
    expect(result).toEqual({ deletedCount: 1 });
    expect(mockModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
  });
});
