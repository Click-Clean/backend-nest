import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from 'passport-kakao';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserRefreshTokenDto } from './dtos/update-user-refresh-token.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUserByProfile(profile: Profile): Promise<User> {
    return await this.userRepository.findOneBy({
      social: profile.provider === 'kakao',
      providerId: profile.id,
    });
  }

  async createUserByProfile(profile: Profile): Promise<User> {
    const user: User = new User(profile);
    return await this.userRepository.save(user);
  }

  async updateUser(
    user: User,
    updateUserDto: UpdateUserRefreshTokenDto | UpdateUserDto,
  ) {
    return this.userRepository.update(user, updateUserDto);
  }
}
