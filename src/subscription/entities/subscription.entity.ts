import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { SubscribeNewsDto } from '../dto/subscribe-news.dto';

@Entity('subscription')
export class Subscription {
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
  @IsString()
  category: string;

  @ApiProperty()
  @Column()
  @IsString()
  media: string;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  static async create(userId: number, subscribeNewsDto: SubscribeNewsDto) {
    const newSubscription = new Subscription();
    newSubscription.userId = userId;
    newSubscription.media = subscribeNewsDto.media;
    newSubscription.category = subscribeNewsDto.category;
    return newSubscription;
  }
}
