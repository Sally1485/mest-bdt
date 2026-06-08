import { Test, TestingModule } from '@nestjs/testing';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';
import { getModelToken } from '@nestjs/mongoose';
import { Response } from './schemas/response.schema';
import { mockModel } from '../common/mocks/model';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccessGuard } from '../common/guards/access.guard';

describe('ResponsesController', () => {
  let controller: ResponsesController;
  let service: ResponsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResponsesController],
      providers: [
        ResponsesService,
        { provide: getModelToken('Response'), useValue: mockModel },
        { provide: getModelToken('User'), useValue: mockModel },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AccessGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ResponsesController>(ResponsesController);
    service = module.get<ResponsesService>(ResponsesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a response', async () => {
    const dto = { formId: 'f1' };
    jest.spyOn(service, 'create').mockResolvedValue(dto as any);
    const result = await controller.create(dto as any);
    expect(result).toEqual(dto);
    expect(service.create as jest.Mock).toHaveBeenCalledWith(dto);
  });

  it('should find all responses', async () => {
    const responses = [{ formId: 'f1' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(responses as any);
    const result = await controller.findAll({ filter: '{}' });
    expect(result).toEqual(responses);
    expect(service.findAll as jest.Mock).toHaveBeenCalledWith({});
  });

  it('should count responses', async () => {
    jest.spyOn(service, 'countDocuments').mockResolvedValue(5);
    const result = await controller.countDocuments({ filter: '{}' });
    expect(result).toEqual(5);
    expect(service.countDocuments as jest.Mock).toHaveBeenCalledWith({});
  });

  it('should find one response', async () => {
    const response = { formId: 'f1' };
    jest.spyOn(service, 'findOne').mockResolvedValue(response as any);
    const result = await controller.findOne('1');
    expect(result).toEqual(response);
  });

  it('should update a response', async () => {
    const dto = { formId: 'Updated' };
    jest.spyOn(service, 'updateOne').mockResolvedValue(dto as any);
    const result = await controller.update('1', dto as any);
    expect(result).toEqual(dto);
  });

  it('should delete a response', async () => {
    jest
      .spyOn(service, 'deleteOne')
      .mockResolvedValue({ deletedCount: 1 } as any);
    const result = await controller.remove('1');
    expect(result).toEqual({ deletedCount: 1 });
  });

  it('returns BMC analytics for a response', async () => {
    const analytics = {
      score: 3.5,
      percentage: 35,
      total: 10,
      answered: 10,
      questions: 10,
    };
    jest.spyOn(service, 'getAnalytics').mockResolvedValue(analytics);
    const result = await controller.analytics('1');
    expect(result).toEqual(analytics);
    expect(service.getAnalytics as jest.Mock).toHaveBeenCalledWith('1');
  });

  it('declares AuthGuard before AccessGuard at the controller level', () => {
    const guards = Reflect.getMetadata(
      GUARDS_METADATA,
      ResponsesController,
    ) as unknown[];
    expect(guards).toEqual([AuthGuard, AccessGuard]);
  });
});
