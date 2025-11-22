import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMongoId } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsMongoId()
  @ApiProperty()
  company: string;

  @IsEnum(['READ', 'WRITE'])
  @ApiProperty()
  access: string;
}
