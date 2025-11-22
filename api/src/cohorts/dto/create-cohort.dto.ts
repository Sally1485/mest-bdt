import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId } from 'class-validator';

export class CreateCohortDto {
  @IsMongoId()
  @ApiProperty()
  program: string;

  @ApiProperty({
    description: 'The name of the cohort.',
    example: 'Cohort 1',
  })
  name: string;

  @ApiProperty({
    description: 'The description of the cohort.',
    example: 'The first cohort of the program.',
  })
  description: string;

  @ApiProperty()
  image: string;

  @IsDateString()
  @ApiProperty()
  startDate: Date;

  @IsDateString()
  @ApiProperty()
  endDate: Date;
}
