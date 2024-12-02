import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { News } from '../../news/entities/news.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comment')
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty()
  @Column()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @Column()
  @IsNumber()
  articleId: number;

  @ApiProperty()
  @Column()
  @IsString()
  user_title: string;

  @ApiProperty()
  @Column()
  @IsNumber()
  probability: number;

  @ApiProperty()
  @CreateDateColumn()
  @IsNumber()
  createdAt: string;

  @ManyToOne(() => News, (news) => news.comments)
  @JoinColumn({ name: 'article_id', referencedColumnName: 'id' })
  article: News;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
