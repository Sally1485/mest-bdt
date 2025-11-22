import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ConflictException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser, HankoUser } from '../common/decorators/user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The profile has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  async create(@Body() createProfileDto: CreateProfileDto) {
    // Ensure profile with email does not exist
    const count = await this.profilesService.countDocuments({
      email: createProfileDto.email,
    });
    if (count) throw new ConflictException('Profile with email already exist!');
    // Proceed to create new profile
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'The profiles have been successfully found.',
  })
  findAll(@Query() filter: JSON) {
    return this.profilesService.findAll(filter);
  }

  @Get('count')
  countDocuments(@Query() filter: JSON) {
    return this.profilesService.countDocuments(filter);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOkResponse({
    description: 'The current user profile has been successfully found.',
  })
  @ApiNotFoundResponse({
    description: 'The profile for the current user was not found.',
  })
  async findCurrentUser(@CurrentUser() user: HankoUser) {
    // Ensure profile with email exist
    const count = await this.profilesService.countDocuments({
      email: user.email.address,
    });
    if (!count)
      throw new NotFoundException('Profile with email does not exist!');
    // Proceed to create new profile
    return this.profilesService.findOne({ email: user.email.address });
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The profile has been successfully found.' })
  @ApiNotFoundResponse({
    description: 'The profile with the given id was not found.',
  })
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne({ _id: id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOkResponse({ description: 'The profile has been successfully updated.' })
  @ApiNotFoundResponse({
    description: 'The profile with the given id was not found.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data provided.' })
  updateOne(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateOne({ _id: id }, updateProfileDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'The profile has been successfully deleted.' })
  @ApiNotFoundResponse({
    description: 'The profile with the given id was not found.',
  })
  deleteOne(@Param('id') id: string) {
    return this.profilesService.deleteOne({ _id: id });
  }
}
