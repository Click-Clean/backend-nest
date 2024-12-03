import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsDate, IsNumber, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('article')
export class News {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty()
  @Column()
  @IsString()
  title: string;

  @ApiProperty()
  @Column()
  @IsString()
  body: string;

  @ApiProperty()
  @Column()
  @IsString()
  summary: string;

  @ApiProperty()
  @Column()
  @IsString()
  media: string;

  @ApiProperty()
  @Column()
  @IsString()
  author: string;

  @ApiProperty()
  @Column()
  @IsUrl()
  url: string;

  @ApiProperty()
  @Column()
  @IsString()
  category: string;

  @ApiProperty()
  @CreateDateColumn()
  @IsDate()
  createdAt: string;

  @ApiProperty()
  @Column()
  @IsNumber()
  probability: number;

  @ApiProperty()
  @Column()
  @IsUrl()
  imageUrl: string;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];
}
