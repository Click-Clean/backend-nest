import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsNumber, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Article {
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
}
