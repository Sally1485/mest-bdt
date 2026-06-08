import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { getModelToken } from '@nestjs/mongoose';
import { Response } from './schemas/response.schema';
import { mockModel } from '../common/mocks/model';

const VALID_ID = 'a'.repeat(24);

describe('ResponsesService', () => {
  let service: ResponsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResponsesService,
        {
          provide: getModelToken(Response.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<ResponsesService>(ResponsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a response', async () => {
    const dto = { formId: 'f1' };
    mockModel.insertOne.mockResolvedValue(dto);
    const result = await service.create(dto as any);
    expect(result).toEqual(dto);
    expect(mockModel.insertOne).toHaveBeenCalledWith(dto);
  });

  it('should count responses', async () => {
    mockModel.countDocuments.mockResolvedValue(10);
    const result = await service.countDocuments({});
    expect(result).toEqual(10);
    expect(mockModel.countDocuments).toHaveBeenCalledWith({});
  });

  it('should find all responses', async () => {
    const responses = [{ formId: 'f1' }];
    mockModel.find.mockResolvedValue(responses);
    const result = await service.findAll({});
    expect(result).toEqual(responses);
    expect(mockModel.find).toHaveBeenCalledWith({});
  });

  it('should find one response', async () => {
    const response = { formId: 'f1' };
    mockModel.findOne.mockResolvedValue(response);
    const result = await service.findOne({ _id: '1' });
    expect(result).toEqual(response);
    expect(mockModel.findOne).toHaveBeenCalledWith({ _id: '1' });
  });

  it('should update a response', async () => {
    const response = { formId: 'Updated' };
    mockModel.updateOne.mockResolvedValue(response);
    const result = await service.updateOne({ _id: '1' }, response);
    expect(result).toEqual(response);
    expect(mockModel.updateOne).toHaveBeenCalledWith({ _id: '1' }, response);
  });

  it('should delete a response', async () => {
    mockModel.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const result = await service.deleteOne({ _id: '1' });
    expect(result).toEqual({ deletedCount: 1 });
    expect(mockModel.deleteOne).toHaveBeenCalledWith({ _id: '1' });
  });

  describe('getAnalytics', () => {
    it('computes BMC analytics from a response', async () => {
      mockModel.findOne.mockReturnThis();
      mockModel.exec.mockResolvedValue({
        data: JSON.stringify({
          q1: 'Yes',
          q1_impact: 8,
          q2: 'No',
          q2_impact: 4,
        }),
      });

      const result = await service.getAnalytics(VALID_ID);

      expect(result).toEqual({
        score: 2,
        percentage: 20,
        total: 10,
        answered: 2,
        questions: 2,
      });
    });

    it('throws 404 for a malformed id without touching the model', async () => {
      await expect(service.getAnalytics('not-an-id')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws 404 when the response is not found', async () => {
      mockModel.findOne.mockReturnThis();
      mockModel.exec.mockResolvedValue(null);
      await expect(service.getAnalytics(VALID_ID)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('throws 404 when stored data is not valid JSON', async () => {
      mockModel.findOne.mockReturnThis();
      mockModel.exec.mockResolvedValue({ data: 'not json{' });
      await expect(service.getAnalytics(VALID_ID)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
