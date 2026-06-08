import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class ListInvitationsQueryDto {
  @IsMongoId({ message: 'Company id must be a valid Mongo ObjectId.' })
  @ApiProperty({
    description: 'The Mongo ObjectId of the company to list invitations for.',
    example: '60f1b9b3b3b3b3b3b3b3b3b3',
  })
  company: string;

  @IsOptional()
  @IsEnum(['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'], {
    message:
      "Status must be one of 'PENDING', 'ACCEPTED', 'EXPIRED', or 'REVOKED'.",
  })
  @ApiPropertyOptional({
    description: 'Filter invitations by status.',
    enum: ['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'],
    example: 'PENDING',
  })
  status?: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
}
