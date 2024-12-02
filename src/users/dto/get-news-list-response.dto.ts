import { ApiProperty } from '@nestjs/swagger';
import { News } from '../../news/entities/news.entity';

export class GetNewsListResponseDto {
  @ApiProperty()
  news: News[];

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page: number;
}
