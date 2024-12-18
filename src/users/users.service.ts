import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from 'passport-kakao';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRefreshTokenDto } from './dto/update-user-refresh-token.dto';

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
    const user: User = await User.create(profile);
    return await this.userRepository.save(user);
  }

  async updateUser(
    user: User,
    updateUserDto: UpdateUserRefreshTokenDto | UpdateUserDto,
  ) {
    return this.userRepository.update(user.id, updateUserDto);
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user === null)
      throw new BadRequestException(`User with id ${id} not found`);
    return user;
  }

  async updateUserById(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  async deleteRefreshToken(id: number) {
    return this.userRepository.update(id, { refreshToken: '' });
  }
}
