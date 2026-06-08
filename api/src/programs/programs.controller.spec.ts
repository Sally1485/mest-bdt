import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsController } from './programs.controller';
import { ProgramsService } from './programs.service';
import { getModelToken } from '@nestjs/mongoose';
import { mockModel } from '../common/mocks/model';

describe('ProgramsController', () => {
  let controller: ProgramsController;
  let service: ProgramsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramsController],
      providers: [
        ProgramsService,
        { provide: getModelToken('Program'), useValue: mockModel },
        { provide: getModelToken('Cohort'), useValue: mockModel },
      ],
    }).compile();

    controller = module.get<ProgramsController>(ProgramsController);
    service = module.get<ProgramsService>(ProgramsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a program', async () => {
    const dto = { name: 'Program 1' };
    jest.spyOn(service, 'create').mockResolvedValue(dto as any);
    const result = await controller.create(dto as any);
    expect(result).toEqual(dto);
  });

  it('should find all programs', async () => {
    const programs = [{ name: 'Program 1' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(programs as any);
    const result = await controller.findAll({ filter: '{}' });
    expect(result).toEqual(programs);
  });

  it('should count programs', async () => {
    jest.spyOn(service, 'countDocuments').mockResolvedValue(5);
    const result = await controller.countDocuments({ filter: '{}' });
    expect(result).toEqual(5);
  });

  it('should find one program', async () => {
    const program = { name: 'Program 1' };
    jest.spyOn(service, 'findOne').mockResolvedValue(program as any);
    const result = await controller.findOne('1');
    expect(result).toEqual(program);
  });

  it('should update a program', async () => {
    const dto = { name: 'Updated' };
    jest.spyOn(service, 'updateOne').mockResolvedValue(dto as any);
    const result = await controller.updateOne('1', dto);
    expect(result).toEqual(dto);
  });

  it('should delete a program', async () => {
    jest
      .spyOn(service, 'deleteOne')
      .mockResolvedValue({ deletedCount: 1 } as any);
    const result = await controller.deleteOne('1');
    expect(result).toEqual({ deletedCount: 1 });
  });
});
