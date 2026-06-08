import { Test, TestingModule } from '@nestjs/testing';
import { CohortsController } from './cohorts.controller';
import { CohortsService } from './cohorts.service';
import { getModelToken } from '@nestjs/mongoose';
import { mockModel } from '../common/mocks/model';

describe('CohortsController', () => {
  let controller: CohortsController;
  let service: CohortsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CohortsController],
      providers: [
        CohortsService,
        { provide: getModelToken('Cohort'), useValue: mockModel },
        { provide: getModelToken('Company'), useValue: mockModel },
      ],
    }).compile();

    controller = module.get<CohortsController>(CohortsController);
    service = module.get<CohortsService>(CohortsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a cohort', async () => {
    const dto = { name: 'Cohort 1', programId: 'p1', startDate: new Date() };
    jest.spyOn(service, 'create').mockResolvedValue(dto as any);
    const result = await controller.create(dto as any);
    expect(result).toEqual(dto);
  });

  it('should find all cohorts', async () => {
    const cohorts = [{ name: 'Cohort 1' }];
    jest
      .spyOn(service, 'findAll' as keyof CohortsService)
      .mockResolvedValue(cohorts as any);
    const result = await controller.findAll({ filter: '{}' });
    expect(result).toEqual(cohorts);
  });

  it('should count cohorts', async () => {
    jest
      .spyOn(service, 'countDocuments' as keyof CohortsService)
      .mockResolvedValue(5);
    const result = await controller.countDocuments({ filter: '{}' });
    expect(result).toEqual(5);
  });

  it('should find one cohort', async () => {
    const cohort = { name: 'Cohort 1' };
    jest
      .spyOn(service, 'findOne' as keyof CohortsService)
      .mockResolvedValue(cohort as any);
    const result = await controller.findOne('1');
    expect(result).toEqual(cohort);
  });

  it('should update a cohort', async () => {
    const dto = { name: 'Updated' };
    jest.spyOn(service, 'updateOne').mockResolvedValue(dto as any);
    const result = await controller.updateOne('1', dto);
    expect(result).toEqual(dto);
  });

  it('should delete a cohort', async () => {
    jest
      .spyOn(service, 'deleteOne')
      .mockResolvedValue({ deletedCount: 1 } as any);
    const result = await controller.deleteOne('1');
    expect(result).toEqual({ deletedCount: 1 });
  });
});
