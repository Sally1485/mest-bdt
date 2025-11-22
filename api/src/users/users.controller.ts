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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() filter: JSON) {
    return this.usersService.findAll(filter);
  }

  @Get('count')
  countDocuments(@Query() filter: JSON) {
    return this.usersService.countDocuments(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ _id: id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne({ _id: id }, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: string) {
    return this.usersService.deleteOne({ _id: id });
  }
}
