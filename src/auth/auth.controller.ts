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
  UnauthorizedException,
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

      return res
        .json({
          access_token: loginResult.accessToken,
          refresh_token: loginResult.refreshToken,
        })
        .redirect(this.configService.get<string>('CLIENT_DOMAIN'));
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error', e);
    }
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Access token refreshed!' })
  @ApiUnauthorizedResponse({ description: `Refresh token is not user's!` })
  @HttpCode(HttpStatus.OK)
  @Get('token-refresh')
  async tokenRefresh(
    @Req() req: Request,
    @UserId(ParseIntPipe) userId: number,
  ): Promise<any> {
    const refreshToken = await this.authService.getRefreshTokenFromHeader(req);
    await this.authService.tokenValidateUser(userId, refreshToken);

    const newAccessToken = await this.authService.createAccessToken(userId);

    return { access_token: newAccessToken };
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(@UserId(ParseIntPipe) userId: number): Promise<any> {
    await this.authService.deleteRefreshTokenOfUser(userId);
    return { access_token: '', refresh_token: '' };
  }
}
