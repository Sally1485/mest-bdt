import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The company has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The companies have been successfully found.',
  })
  findAll(@Query() { filter = '{}' }: { filter: string }) {
    return this.companiesService.findAll(JSON.parse(filter) as object);
  }

  @Get('count')
  countDocuments(@Query() { filter = '{}' }: { filter: string }) {
    return this.companiesService.countDocuments(JSON.parse(filter) as object);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The company has been successfully found.' })
  @ApiNotFoundResponse({
    description: 'The company with the given id was not found.',
  })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne({ _id: id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOkResponse({ description: 'The company has been successfully updated.' })
  @ApiNotFoundResponse({
    description: 'The company with the given id was not found.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  updateOne(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateOne({ _id: id }, updateCompanyDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'The company has been successfully deleted.' })
  @ApiNotFoundResponse({
    description: 'The company with the given id was not found.',
  })
  deleteOne(@Param('id') id: string) {
    return this.companiesService.deleteOne({ _id: id });
  }
}
