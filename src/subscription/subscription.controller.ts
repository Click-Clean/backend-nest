import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { UserId } from '../users/decorators/user-id.decorator';
import { SubscribeNewsDto } from './dto/subscribe-news.dto';
import { Subscription } from './entities/subscription.entity';
import { ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('api/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiResponse({ type: Subscription })
  @UseGuards(AccessTokenGuard)
  async subscribeNews(
    @UserId() userId: number,
    @Body() subscriptionNewsDto: SubscribeNewsDto,
  ): Promise<Subscription> {
    console.log(userId);
    return await this.subscriptionService.subscribeNews(
      userId,
      subscriptionNewsDto,
    );
  }
}
