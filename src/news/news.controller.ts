import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { GetNewsListQueryDTO } from './dto/get-news-list-query.dto';
import { ApiResponse } from '@nestjs/swagger';
import { GetNewsListResponseDto } from '../users/dto/get-news-list-response.dto';
import { Comment } from '../comment/entities/comment.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiResponse({ type: GetNewsListResponseDto })
  async findAll(
    @Query() getNewsListQuery: GetNewsListQueryDTO,
  ): Promise<GetNewsListResponseDto> {
    return this.newsService.findNewsList(getNewsListQuery);
  }

  @Get('/:newsId/comments')
  async getComments(@Param('newsId') newsId: string): Promise<Comment[]> {
    return await this.newsService.findNewsComments(+newsId);
  }
}
