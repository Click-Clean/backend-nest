import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetNewsListQueryDTO {
  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({ nullable: true })
  @IsNumber()
  @IsOptional()
  probability: number = 0;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  media: string;

  @ApiProperty({ nullable: true })
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiProperty({ nullable: true })
  @IsNumber()
  @IsOptional()
  size: number = 10;
}
