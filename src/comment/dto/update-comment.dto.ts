import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsNumber } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
