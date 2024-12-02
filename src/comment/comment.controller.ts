import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UserId } from '../users/decorators/user-id.decorator';
import { Comment } from './entities/comment.entity';
import { ApiResponse } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiResponse({ type: Comment, status: 200 })
  @UseGuards(AccessTokenGuard)
  async create(
    @UserId(ParseIntPipe) userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    createCommentDto.userId = userId;
    return this.commentService.create(createCommentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiResponse({ type: UpdateResult })
  async update(
    @UserId(ParseIntPipe) userId: number,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateResult> {
    await this.commentService.validateUserComment(userId, +id);
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiResponse({ type: String })
  async remove(
    @UserId(ParseIntPipe) userId: number,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    await this.commentService.validateUserComment(userId, +id);
    return this.commentService.remove(+id);
  }
}
