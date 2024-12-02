import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  userId: number;

  @ApiProperty()
  @IsString()
  userTitle: string;
}
