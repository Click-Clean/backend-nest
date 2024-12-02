import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Profile } from 'passport-kakao';
import { KakaoGuard } from './guards/kakao.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TokenResponseDto } from './dtos/token-response.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { UserId } from '../users/decorators/user-id.decorator';
import { UpdateResult } from 'typeorm';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { User } from '../users/entities/user.entity';

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

      res
        .cookie('access_token', loginResult.accessToken, {
          sameSite: 'lax',
          httpOnly: true,
          maxAge: this.configService.get<number>('ACCESS_TOKEN_MAX_AGE'),
        })
        .cookie('refresh_token', loginResult.refreshToken, {
          sameSite: 'lax',
          httpOnly: true,
          maxAge: this.configService.get<number>('REFRESH_TOKEN_MAX_AGE'),
        })
        .redirect(this.configService.get<string>('CLIENT_DOMAIN'));
    } catch (e) {
      throw new InternalServerErrorException(e.message());
    }
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Access token refreshed!' })
  @ApiUnauthorizedResponse({ description: `Refresh token is not user's!` })
  @HttpCode(HttpStatus.CREATED)
  @Get('token-refresh')
  async tokenRefresh(
    @Req() req: Request,
    @UserId(ParseIntPipe) userId: number,
    @Res() res: Response,
  ): Promise<any> {
    const refreshToken = await this.authService.getRefreshTokenFromHeader(req);
    const user: User = await this.authService.tokenValidateUser(userId);
    if (user.refreshToken !== refreshToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ msg: `This refresh token is not user's token` });
    }

    const newAccessToken = await this.authService.createAccessToken(user);

    return res
      .cookie('access_token', newAccessToken, {
        sameSite: 'lax',
        httpOnly: true,
        maxAge: this.configService.get<number>('ACCESS_TOKEN_MAX_AGE'),
      })
      .status(HttpStatus.CREATED)
      .json({ msg: 'Refresh token successfully.' });
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @UserId(ParseIntPipe) userId: number,
    @Res() res: Response,
  ): Promise<any> {
    await this.authService.deleteRefreshTokenOfUser(userId);
    return res
      .cookie('access_token', '', { maxAge: 0 })
      .cookie('refresh_token', '', { maxAge: 0 })
      .send();
  }
}
