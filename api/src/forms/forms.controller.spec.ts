import { Test, TestingModule } from '@nestjs/testing';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';
import { getModelToken } from '@nestjs/mongoose';
import { mockModel } from '../common/mocks/model';

describe('FormsController', () => {
  let controller: FormsController;
  let service: FormsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsController],
      providers: [
        FormsService,
        { provide: getModelToken('Form'), useValue: mockModel },
        { provide: getModelToken('Response'), useValue: mockModel },
      ],
    }).compile();

    controller = module.get<FormsController>(FormsController);
    service = module.get<FormsService>(FormsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a form', async () => {
    const dto = { name: 'Form 1' };
    jest.spyOn(service, 'findOne').mockResolvedValue(null);
    jest.spyOn(service, 'create').mockResolvedValue(dto as any);
    const result = await controller.create(dto as any);
    expect(result).toEqual(dto);
  });

  it('should find all forms', async () => {
    const forms = [{ name: 'Form 1' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(forms as any);
    const result = await controller.findAll({ filter: '{}' });
    expect(result).toEqual(forms);
    expect(service.findAll as jest.Mock).toHaveBeenCalledWith({});
  });

  it('should count forms', async () => {
    jest.spyOn(service, 'countDocuments').mockResolvedValue(5);
    const result = await controller.countDocuments({ filter: '{}' });
    expect(result).toEqual(5);
    expect(service.countDocuments as jest.Mock).toHaveBeenCalledWith({});
  });

  it('should find one form', async () => {
    const form = { name: 'Form 1' };
    jest.spyOn(service, 'findOne').mockResolvedValue(form as any);
    const result = await controller.findOne('1');
    expect(result).toEqual(form);
  });

  it('should update a form', async () => {
    const dto = { name: 'Updated' };
    jest.spyOn(service, 'updateOne').mockResolvedValue(dto as any);
    const result = await controller.updateOne('1', dto);
    expect(result).toEqual(dto);
  });

  it('should delete a form', async () => {
    jest
      .spyOn(service, 'deleteOne')
      .mockResolvedValue({ deletedCount: 1 } as any);
    const result = await controller.deleteOne('1');
    expect(result).toEqual({ deletedCount: 1 });
  });
});
