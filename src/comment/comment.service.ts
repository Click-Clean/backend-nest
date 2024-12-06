import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return await this.commentRepository.save(
      this.commentRepository.create(createCommentDto),
    );
  }

  findAll() {
    return `This action returns all comment`;
  }

  async findOne(id: number) {
    return await this.commentRepository.findOneBy({ id });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    return await this.commentRepository.update(id, updateCommentDto);
  }

  remove(id: number) {
    return this.commentRepository.delete(id);
  }

  async validateUserComment(userId: number, commentId: number) {
    if (!(await this.commentRepository.findOneBy({ id: commentId, userId }))) {
      throw new UnauthorizedException(
        `Comment ${commentId} does not exist or not yours`,
      );
    }
  }

  async findAllComments(newsId: number): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { id: newsId },
      order: {
        probability: 'DESC',
        createdAt: 'DESC',
      },
    });
  }
}
