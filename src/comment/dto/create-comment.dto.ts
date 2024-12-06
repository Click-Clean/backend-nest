import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateCommentDto {
  userId: number;

  @ApiProperty()
  @IsString()
  userTitle: string;

  @ApiProperty()
  @IsInt()
  articleId: number;
}
