import { Test, TestingModule } from '@nestjs/testing';
import { UploadsService } from './uploads.service';
import { BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

jest.mock('cloudinary');

describe('UploadsService', () => {
  let service: UploadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadsService],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    const mockFile = {
      buffer: Buffer.from('test-image'),
      mimetype: 'image/png',
    } as Express.Multer.File;

    it('should successfully upload an image', async () => {
      const mockResult = { secure_url: 'https://test-url.com' };

      const mockUploadStream = {
        end: jest.fn().mockReturnThis(),
      };

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options: any, callback: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          callback(null, mockResult);
          return mockUploadStream;
        },
      );

      const result = await service.uploadImage(mockFile);
      expect(result).toEqual({ url: mockResult.secure_url });
      expect(
        cloudinary.uploader.upload_stream as jest.Mock,
      ).toHaveBeenCalledWith({ resource_type: 'image' }, expect.any(Function));
    });

    it('should throw BadRequestException if no file is provided', async () => {
      await expect(
        service.uploadImage(null as unknown as Express.Multer.File),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if invalid mime type', async () => {
      const invalidFile = {
        ...mockFile,
        mimetype: 'application/pdf',
      };
      await expect(service.uploadImage(invalidFile)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if Cloudinary upload fails', async () => {
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback: (error: any, result: any) => void) => {
          callback(new Error('Upload failed'), null);
          return { end: jest.fn() };
        },
      );

      await expect(service.uploadImage(mockFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
