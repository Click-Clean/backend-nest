import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Profile } from 'passport-kakao';
import { KakaoGuard } from './guards/kakao.guard';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TokenResponseDto } from './dtos/token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get('/kakao/callback')
  @ApiCreatedResponse({ description: 'Kakao User Successfully Logged In!' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(KakaoGuard)
  async kakaoCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const profile: Profile = req.user as Profile;

      const loginResult: TokenResponseDto =
        await this.authService.kakaoLogIn(profile);

      return res
        .cookie('access_token', loginResult.accessToken)
        .cookie('refresh_token', loginResult.refreshToken)
        .redirect(this.configService.get<string>('CLIENT_DOMAIN'));
    } catch (e) {
      throw new InternalServerErrorException(e.message());
    }
  }
}
