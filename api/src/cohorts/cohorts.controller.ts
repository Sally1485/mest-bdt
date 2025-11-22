import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
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
import { CohortsService } from './cohorts.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('cohorts')
@Controller('cohorts')
export class CohortsController {
  constructor(private readonly cohortsService: CohortsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The cohort has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  create(@Body() createCohortDto: CreateCohortDto) {
    // TODO: Ensure program used to create cohort exist
    // Create and return cohort
    return this.cohortsService.create(createCohortDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The cohorts have been successfully found.',
  })
  findAll(@Query() { filter = '{}' }: { filter: string }) {
    return this.cohortsService.findAll(JSON.parse(filter) as object);
  }

  @Get('count')
  countDocuments(@Query() { filter = '{}' }: { filter: string }) {
    return this.cohortsService.countDocuments(JSON.parse(filter) as object);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The cohort has been successfully found.' })
  @ApiNotFoundResponse({
    description: 'The cohort with the given id was not found.',
  })
  findOne(@Param('id') id: string) {
    return this.cohortsService.findOne({ _id: id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOkResponse({ description: 'The cohort has been successfully updated.' })
  @ApiNotFoundResponse({
    description: 'The cohort with the given id was not found.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  updateOne(@Param('id') id: string, @Body() updateCohortDto: UpdateCohortDto) {
    return this.cohortsService.updateOne({ _id: id }, updateCohortDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'The cohort has been successfully deleted.' })
  @ApiNotFoundResponse({
    description: 'The cohort with the given id was not found.',
  })
  deleteOne(@Param('id') id: string) {
    return this.cohortsService.deleteOne({ _id: id });
  }
}
