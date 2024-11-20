import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Profile } from 'passport-kakao';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserRefreshTokenDto } from '../users/dtos/update-user-refresh-token.dto';
import { TokenResponseDto } from './dtos/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async kakaoLogIn(profile: Profile): Promise<TokenResponseDto> {
    const user: User = await this.validateKakaoUser(profile);

    const accessToken: string = await this.createAccessToken(user);
    const refreshToken: string = await this.createRefreshToken(user);

    const updateUserRefreshTokenDto: UpdateUserRefreshTokenDto = {
      refreshToken,
    };

    await this.usersService.updateUser(user, updateUserRefreshTokenDto);

    return { accessToken, refreshToken };
  }

  async validateKakaoUser(profile: Profile): Promise<User> {
    const user: User = await this.usersService.findUserByProfile(profile);

    if (!user) {
      return await this.usersService.createUserByProfile(profile);
    }
    return user;
  }

  async createAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = { id: user.id };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
    });
  }

  async createRefreshToken(user: User): Promise<string> {
    const payload: JwtPayload = { id: user.id };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
    });
  }
}
