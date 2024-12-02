import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { GetNewsListQueryDTO } from './dto/get-news-list-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Comment } from '../comment/entities/comment.entity';
import { CommentService } from '../comment/comment.service';
import { GetNewsListResponseDto } from '../users/dto/get-news-list-response.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private readonly commentService: CommentService,
  ) {}

  async findNewsList(
    getNewsListQuery: GetNewsListQueryDTO,
  ): Promise<GetNewsListResponseDto> {
    const [news, cnt] = await this.newsRepository.findAndCount({
      where: {
        category: getNewsListQuery.category,
        media: getNewsListQuery.media,
        probability: MoreThanOrEqual(getNewsListQuery.probability),
      },
      skip: (getNewsListQuery.page - 1) * getNewsListQuery.size,
      take: getNewsListQuery.size,
    });
    return {
      news,
      totalPages: Math.floor(cnt / getNewsListQuery.size) + 1,
      page: getNewsListQuery.page,
    };
  }

  async findNewsComments(newsId: number): Promise<Comment[]> {
    return await this.commentService.findAllComments(newsId);
  }
}
