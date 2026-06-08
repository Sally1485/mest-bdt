import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { NotFoundException } from '@nestjs/common';
import { mockModel } from '../common/mocks/model';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        ProfilesService,
        { provide: getModelToken('Profile'), useValue: mockModel },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a profile', async () => {
    const dto = { name: 'Profile 1', email: 'test@example.com' };
    jest.spyOn(service, 'countDocuments').mockResolvedValue(0);
    jest.spyOn(service, 'create').mockResolvedValue(dto as any);
    const result = await controller.create(dto);
    expect(result).toEqual(dto);
  });

  it('should throw BadRequestException if profile with email exists', async () => {
    const dto = { name: 'Profile 1', email: 'test@example.com' };
    jest.spyOn(service, 'countDocuments').mockResolvedValue(1);
    await expect(controller.create(dto as any)).rejects.toThrow();
  });

  it('should find all profiles', async () => {
    const profiles = [{ name: 'Profile 1' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(profiles as any);
    const result = await controller.findAll({ filter: '{}' });
    expect(result).toEqual(profiles);
  });

  it('should count profiles', async () => {
    jest.spyOn(service, 'countDocuments').mockResolvedValue(5);
    const result = await controller.countDocuments({ filter: '{}' });
    expect(result).toEqual(5);
    expect(service.countDocuments as jest.Mock).toHaveBeenCalledWith({});
  });

  it('should find one profile', async () => {
    const profile = { name: 'Profile 1' };
    jest.spyOn(service, 'findOne').mockResolvedValue(profile as any);
    const result = await controller.findOne('1');
    expect(result).toEqual(profile);
    expect(service.findOne as jest.Mock).toHaveBeenCalledWith({ _id: '1' });
  });

  describe('findCurrentUser', () => {
    const mockHankoUser = { email: { address: 'test@test.com' } } as any;

    it('should return current user profile', async () => {
      jest.spyOn(service, 'countDocuments').mockResolvedValue(1);
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ name: 'Profile' } as any);
      const result = await controller.findCurrentUser(mockHankoUser);
      expect(result).toEqual({ name: 'Profile' });
    });

    it('should throw NotFoundException if profile not found', async () => {
      jest.spyOn(service, 'countDocuments').mockResolvedValue(0);
      await expect(controller.findCurrentUser(mockHankoUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  it('should update a profile', async () => {
    const dto = { name: 'Updated' };
    jest.spyOn(service, 'findOne').mockResolvedValue({ _id: '1' } as any);
    jest.spyOn(service, 'updateOne').mockResolvedValue(dto as any);
    const result = await controller.updateOne('1', dto as any);
    expect(result).toEqual(dto);
    expect(service.findOne as jest.Mock).toHaveBeenCalledWith({ _id: '1' });
  });

  it('should throw NotFoundException if updating non-existent profile', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(null);
    await expect(controller.updateOne('1', {} as any)).rejects.toThrow();
  });

  it('should delete a profile', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue({ _id: '1' } as any);
    jest
      .spyOn(service, 'deleteOne')
      .mockResolvedValue({ deletedCount: 1 } as any);
    const result = await controller.deleteOne('1');
    expect(result).toEqual({ deletedCount: 1 });
    expect(service.findOne as jest.Mock).toHaveBeenCalledWith({ _id: '1' });
  });

  it('should throw NotFoundException if deleting non-existent profile', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(null);
    await expect(controller.deleteOne('1')).rejects.toThrow();
  });
});
