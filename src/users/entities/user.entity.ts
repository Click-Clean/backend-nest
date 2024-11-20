import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Profile } from 'passport-kakao';
import { generateUsername } from 'unique-username-generator';

@Entity('users')
export class User {
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

  static async createByProfile(profile: Profile): Promise<User> {
    const newUser = new User();
    newUser.providerId = profile.id;
    newUser.social = profile.provider === 'kakao';
    newUser.username = profile.username ?? (await this.createRandomNickname());
    return newUser;
  }

  static async createRandomNickname(): Promise<string> {
    return generateUsername('-', 3, 8, 'User');
  }
}
