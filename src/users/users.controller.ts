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
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getUserData(@UserId(ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  @Patch()
  @UseGuards(AccessTokenGuard)
  async updateUserData(
    @UserId(ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }
}
