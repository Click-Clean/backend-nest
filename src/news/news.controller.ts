import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { GetNewsListQueryDTO } from './dto/get-news-list-query.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async findAll(@Query() getNewsListQuery: GetNewsListQueryDTO) {
    return this.newsService.findNewsList(getNewsListQuery);
  }

  @Get('/:newsId/comments')
  async getComments(@Param('newsId') newsId: string) {
    return this.newsService.findNewsComments(+newsId);
  }
}
