import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserId } from './decorators/user-id.decorator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ type: User })
  @UseGuards(AccessTokenGuard)
  async getUserData(@UserId(ParseIntPipe) id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Patch()
  @ApiResponse({ type: UpdateResult })
  @UseGuards(AccessTokenGuard)
  async updateUserData(
    @UserId(ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }
}
