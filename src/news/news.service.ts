import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { GetNewsListQueryDTO } from './dto/get-news-list-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  create(createNewsDto: CreateNewsDto) {
    return 'This action adds a new news';
  }

  async findNewsList(getNewsListQuery: GetNewsListQueryDTO) {
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

  findOne(id: number) {
    return `This action returns a #${id} news`;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    return `This action updates a #${id} news`;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
}
