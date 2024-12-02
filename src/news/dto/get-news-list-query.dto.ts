import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetNewsListQueryDTO {
  @ApiProperty({ nullable: true, required: false })
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({ nullable: true, required: false })
  @IsNumber()
  @IsOptional()
  probability: number = 0;

  @ApiProperty({ nullable: true, required: false })
  @IsString()
  @IsOptional()
  media: string;

  @ApiProperty({ nullable: true, required: false })
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiProperty({ nullable: true, required: false })
  @IsNumber()
  @IsOptional()
  size: number = 10;
}
