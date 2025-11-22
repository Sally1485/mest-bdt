import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsMongoId()
  @ApiProperty()
  cohort: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the company.',
    example: 'Acme Corporation',
  })
  name: string;

  @ApiProperty({
    description: 'The main point of contact for the company.',
    example: 'John Doe',
  })
  mainPointOfContact: string;

  @ApiProperty({
    description: 'The alternative point of contact for the company.',
    example: 'Jane Doe',
  })
  altPointOfContact: string;

  @ApiProperty({
    description: 'The project manager for the company.',
    example: 'Peter Pan',
  })
  projectManager: string;

  @ApiProperty({
    description: 'The key organizational units of the company.',
    example: 3,
  })
  keyOrgUnits: number;

  @ApiProperty({
    description: 'The mission of the company.',
    example: 'To provide high-quality products and services to our customers.',
  })
  mission: string;

  @ApiProperty({
    description: 'The sector in which the company operates.',
    example: 'Technology',
  })
  sector: string;

  @ApiProperty({
    description: 'The product or service offered by the company.',
    example: 'Software development',
  })
  productOrService: string;

  @ApiProperty({
    description: 'The annual revenue of the company.',
    example: 1000000,
  })
  annualRevenue: number;

  @ApiProperty({
    description: 'The number of years the company has been in operation.',
    example: 5,
  })
  operationalYears: number;

  @ApiProperty({
    description: 'The total number of users of the company product or service.',
    example: 1000,
  })
  totalUsers: number;

  @ApiProperty({
    description: 'The total number of employees in the company.',
    example: 50,
  })
  totalEmployees: number;

  @ApiProperty({
    description: 'The expectation of the company.',
    example: 'To grow and expand our business.',
  })
  expectation: string;
}
