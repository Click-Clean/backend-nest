import {
  Controller,
  Get,
  InternalServerErrorException,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Profile } from 'passport-kakao';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/kakao/callback')
  async kakaoCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const profile = req.user as Profile;
    } catch (e) {
      throw new InternalServerErrorException(e.message());
    }
  }
}
