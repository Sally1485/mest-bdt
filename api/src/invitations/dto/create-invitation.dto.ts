import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMongoId } from 'class-validator';

export class CreateInvitationDto {
  @IsEmail(
    {},
    { message: 'Email is required and must be a valid email address.' },
  )
  @ApiProperty({
    description: 'The email address of the invitee.',
    example: 'invitee@example.com',
  })
  email: string;

  @IsMongoId({ message: 'Company id must be a valid Mongo ObjectId.' })
  @ApiProperty({
    description:
      'The Mongo ObjectId of the company the invitee is being invited to.',
    example: '60f1b9b3b3b3b3b3b3b3b3b3',
  })
  company: string;

  @IsEnum(['READ', 'WRITE'], {
    message: "Access must be either 'READ' or 'WRITE'.",
  })
  @ApiProperty({
    description: 'The access level granted to the invitee upon acceptance.',
    enum: ['READ', 'WRITE'],
    example: 'WRITE',
  })
  access: 'READ' | 'WRITE';
}
