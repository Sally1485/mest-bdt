import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateProgramDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the program.',
    example: 'Business Development Program',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the program.',
    example: 'A program to help businesses grow.',
  })
  description: string;

  @IsNotEmpty()
  @ApiProperty()
  image: string;

  @IsDateString()
  @ApiProperty()
  startDate: Date;

  @IsDateString()
  @ApiProperty()
  endDate: Date;
}
