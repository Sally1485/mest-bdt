import { Test, TestingModule } from '@nestjs/testing';
import { ProgramsService } from './programs.service';
import { getModelToken } from '@nestjs/mongoose';
import { mockModel } from '../common/mocks/model';
import { ConflictException } from '@nestjs/common';

const programModelMock = { ...mockModel };
const cohortModelMock = { ...mockModel };

describe('ProgramsService', () => {
  let service: ProgramsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramsService,
        { provide: getModelToken('Program'), useValue: programModelMock },
        { provide: getModelToken('Cohort'), useValue: cohortModelMock },
      ],
    }).compile();

    service = module.get<ProgramsService>(ProgramsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a program', async () => {
    const dto = { name: 'Program 1' };
    programModelMock.insertOne.mockResolvedValue(dto);
    const result = await service.create(dto);
    expect(result).toEqual(dto);
    expect(programModelMock.insertOne).toHaveBeenCalledWith(dto);
  });

  it('should count programs', async () => {
    programModelMock.countDocuments.mockResolvedValue(10);
    const result = await service.countDocuments({});
    expect(result).toEqual(10);
    expect(programModelMock.countDocuments).toHaveBeenCalledWith({});
  });

  it('should find all programs', async () => {
    const programs = [{ name: 'Program 1' }];
    programModelMock.find.mockResolvedValue(programs);
    const result = await service.findAll({});
    expect(result).toEqual(programs);
    expect(programModelMock.find).toHaveBeenCalledWith({});
  });

  it('should find one program', async () => {
    const program = { name: 'Program 1' };
    programModelMock.findOne.mockResolvedValue(program);
    const result = await service.findOne({ _id: '1' });
    expect(result).toEqual(program);
    expect(programModelMock.findOne).toHaveBeenCalledWith({ _id: '1' });
  });

  it('should update a program', async () => {
    const program = { name: 'Updated Program' };
    programModelMock.updateOne.mockResolvedValue(program);
    const result = await service.updateOne({ _id: '1' }, program);
    expect(result).toEqual(program);
    expect(programModelMock.updateOne).toHaveBeenCalledWith(
      { _id: '1' },
      program,
    );
  });

  describe('deleteOne', () => {
    it('should delete program if no cohorts exist', async () => {
      const program = { _id: 'pid1', name: 'Program 1' };
      programModelMock.findOne.mockResolvedValue(program);
      cohortModelMock.countDocuments.mockResolvedValue(0);
      programModelMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.deleteOne({ _id: 'pid1' });
      expect(result).toEqual({ deletedCount: 1 });
    });

    it('should throw ConflictException if cohorts exist for program', async () => {
      const program = { _id: 'pid1', name: 'Program 1' };
      programModelMock.findOne.mockResolvedValue(program);
      cohortModelMock.countDocuments.mockResolvedValue(4);

      await expect(service.deleteOne({ _id: 'pid1' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should still delete if program not found', async () => {
      programModelMock.findOne.mockResolvedValue(null);
      programModelMock.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const result = await service.deleteOne({ _id: 'non-existent' });
      expect(result).toEqual({ deletedCount: 0 });
    });
  });
});
