import {
  Controller,
  Param,
  Post,
  Body,
  Get,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TweetService } from './tweet.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

type CreatePost = {
  userId: string;
  username: string;
  tweet: string;
};

@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  // CREATE A POST
  @UseGuards(AuthenticatedGuard)
  @Post('/createTweet')
  async postTweet(@Body() body: CreatePost) {
    console.log({ body });
    const result = await this.tweetService.createTweet(
      body.userId,
      body.username,
      body.tweet,
    );
    return {
      result,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Put('/updateTweet')
  async updatePost(
    @Body('userId') userId: string,
    @Body('tweetId') tweetId: string,
    @Body('tweet') tweet: string,
  ) {
    const updated = await this.tweetService.updateTweet(userId, tweetId, tweet);
    return { updated };
  }
}

// DELETE A POST

// READ A POST
//   @Get('getTweet')
//   getTweet(@Request() req) {
//     const result = this.tweetService.createTweet();
//     return { result };
//   }
// }
