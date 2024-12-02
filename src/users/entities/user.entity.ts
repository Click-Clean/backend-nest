import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Profile as KakaoProfile } from 'passport-kakao';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { generateUsername } from 'unique-username-generator';
import { Subscription } from '../../subscription/entities/subscription.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('users')
export class User {
  static async create(profile: KakaoProfile | GoogleProfile) {
    const newUser = new User();
    newUser.providerId = profile.id;
    newUser.social = profile.provider === 'kakao';
    newUser.username = profile.username ?? User.createRandomNickname();
    return newUser;
  }

  @ApiProperty()
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @Column()
  username: string;

  @ApiProperty()
  @IsString()
  @Column({ nullable: true })
  email: string;

  @ApiProperty()
  @IsDate()
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty()
  @IsBoolean()
  @Column()
  social: boolean;

  @IsString()
  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @ApiProperty()
  @IsString()
  @Column()
  providerId: string;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  static createRandomNickname(): string {
    return generateUsername('-', 3, 8, 'User');
  }
}
