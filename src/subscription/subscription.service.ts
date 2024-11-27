import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscribeNewsDto } from './dto/subscribe-news.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async subscribeNews(
    userId: number,
    subscribeNewsDto: SubscribeNewsDto,
  ): Promise<Subscription> {
    return await this.subscriptionRepository.save(
      await Subscription.create(userId, subscribeNewsDto),
    );
  }
}
