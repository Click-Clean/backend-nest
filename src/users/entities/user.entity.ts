import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Profile as KakaoProfile } from 'passport-kakao';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { generateUsername } from 'unique-username-generator';

@Entity('users')
export class User {
  constructor(profile: KakaoProfile | GoogleProfile) {
    this.providerId = profile.id;
    this.social = profile.provider === 'kakao';
    this.username = profile.username ?? this.createRandomNickname();
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

  @ApiProperty()
  @IsString()
  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @ApiProperty()
  @IsString()
  @Column()
  providerId: string;

  private createRandomNickname(): string {
    return generateUsername('-', 3, 8, 'User');
  }
}
