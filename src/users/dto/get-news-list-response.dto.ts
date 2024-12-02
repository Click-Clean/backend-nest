import { ApiProperty } from '@nestjs/swagger';
import { News } from '../../news/entities/news.entity';

export class GetNewsListResponseDto {
  @ApiProperty({ type: [News] })
  news: News[];

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page: number;
}
