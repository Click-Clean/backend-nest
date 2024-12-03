import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from '../jwt.payload';

@Injectable()
export class RefreshTokenStrategy extends AuthGuard('refresh_token') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback): Promise<any> {
    return done(null, payload);
  }
}
