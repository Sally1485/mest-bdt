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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';
import { Response } from './schemas/response.schema';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccessGuard } from '../common/guards/access.guard';

@ApiTags('responses')
@ApiBearerAuth()
@ApiInternalServerErrorResponse({ description: 'Internal server error.' })
@UseGuards(AuthGuard, AccessGuard)
@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new response' })
  @ApiCreatedResponse({
    description: 'The response has been successfully created.',
    type: Response,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(@Body() createResponseDto: CreateResponseDto) {
    return this.responsesService.create(createResponseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all responses' })
  @ApiOkResponse({
    description: 'The responses have been successfully found.',
    type: [Response],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async findAll(@Query() { filter = '{}' }: { filter: string }) {
    return this.responsesService.findAll(JSON.parse(filter) as object);
  }

  @Get('count')
  @ApiOperation({ summary: 'Count total responses' })
  @ApiOkResponse({ description: 'The count of responses', type: Number })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  countDocuments(@Query() { filter = '{}' }: { filter: string }) {
    return this.responsesService.countDocuments(JSON.parse(filter) as object);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a response by id' })
  @ApiOkResponse({
    description: 'The response has been successfully found.',
    type: Response,
  })
  @ApiNotFoundResponse({
    description: 'The response with the given id was not found.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  async findOne(@Param('id') id: string) {
    return this.responsesService.findOne({ _id: id });
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get BMC diagnostic analytics for a response' })
  @ApiOkResponse({
    description:
      'Per-block BMC analytics: score (mean signed impact), percentage, and totals.',
  })
  @ApiNotFoundResponse({
    description: 'The response with the given id was not found.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async analytics(@Param('id') id: string) {
    return this.responsesService.getAnalytics(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a response' })
  @ApiOkResponse({
    description: 'The response has been successfully updated.',
    type: Response,
  })
  @ApiNotFoundResponse({
    description: 'The response with the given id was not found.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() updateResponseDto: UpdateResponseDto,
  ) {
    return this.responsesService.updateOne({ _id: id }, updateResponseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a response' })
  @ApiOkResponse({
    description: 'The response has been successfully deleted.',
    type: Response,
  })
  @ApiNotFoundResponse({
    description: 'The response with the given id was not found.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async remove(@Param('id') id: string) {
    return this.responsesService.deleteOne({ _id: id });
  }
}
