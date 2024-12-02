import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  @IsString()
  userTitle: string;
}
