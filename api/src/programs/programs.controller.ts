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
import { ProgramsService } from './programs.service';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateProgramDto } from './dto/create-program.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('programs')
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The program has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programsService.create(createProgramDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The programs have been successfully found.',
  })
  findAll(@Query() { filter = '{}' }: { filter: string }) {
    return this.programsService.findAll(JSON.parse(filter) as object);
  }

  @Get('count')
  countDocuments(@Query() { filter = '{}' }: { filter: string }) {
    return this.programsService.countDocuments(JSON.parse(filter) as object);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The program has been successfully found.' })
  @ApiNotFoundResponse({
    description: 'The program with the given id was not found.',
  })
  findOne(@Param('id') id: string) {
    return this.programsService.findOne({ _id: id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOkResponse({ description: 'The program has been successfully updated.' })
  @ApiNotFoundResponse({
    description: 'The program with the given id was not found.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  updateOne(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ) {
    return this.programsService.updateOne({ _id: id }, updateProgramDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'The program has been successfully deleted.' })
  @ApiNotFoundResponse({
    description: 'The program with the given id was not found.',
  })
  deleteOne(@Param('id') id: string) {
    return this.programsService.deleteOne({ _id: id });
  }
}
