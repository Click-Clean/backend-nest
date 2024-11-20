import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdateUserRefreshTokenDto extends PickType(PartialType(User), [
  'refreshToken',
]) {}
