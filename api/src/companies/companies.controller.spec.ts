import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { getModelToken } from '@nestjs/mongoose';
import { mockModel } from '../common/mocks/model';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        CompaniesService,
        { provide: getModelToken('Company'), useValue: mockModel },
        { provide: getModelToken('Response'), useValue: mockModel },
        { provide: getModelToken('User'), useValue: mockModel },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a company', async () => {
    const dto = { name: 'Company 1' };
    jest.spyOn(service, 'create').mockResolvedValue(dto as any);
    const result = await controller.create(dto as any);
    expect(result).toEqual(dto);
    expect(service.create as jest.Mock).toHaveBeenCalledWith(dto);
  });

  it('should find all companies', async () => {
    const companies = [{ name: 'Company 1' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(companies as any);
    const result = await controller.findAll({ filter: '{}' });
    expect(result).toEqual(companies);
    expect(service.findAll as jest.Mock).toHaveBeenCalledWith({});
  });

  it('should count companies', async () => {
    jest.spyOn(service, 'countDocuments').mockResolvedValue(5);
    const result = await controller.countDocuments({ filter: '{}' });
    expect(result).toEqual(5);
    expect(service.countDocuments as jest.Mock).toHaveBeenCalledWith({});
  });

  it('should find one company', async () => {
    const company = { name: 'Company 1' };
    jest.spyOn(service, 'findOne').mockResolvedValue(company as any);
    const result = await controller.findOne('1');
    expect(result).toEqual(company);
  });

  it('should update a company', async () => {
    const dto = { name: 'Updated' };
    jest.spyOn(service, 'updateOne').mockResolvedValue(dto as any);
    const result = await controller.updateOne('1', dto);
    expect(result).toEqual(dto);
  });

  it('should delete a company', async () => {
    jest
      .spyOn(service, 'deleteOne')
      .mockResolvedValue({ deletedCount: 1 } as any);
    const result = await controller.deleteOne('1');
    expect(result).toEqual({ deletedCount: 1 });
  });
});
