import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([News]), CommentModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}