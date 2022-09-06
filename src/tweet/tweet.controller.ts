import {
  Controller,
  Param,
  Post,
  Body,
  Get,
  Put,
  Request,
  UseGuards,
  Delete,
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

  @UseGuards(AuthenticatedGuard)
  @Post('/readTweetById')
  async readTweetById(@Body('tweetId') tweetId: string) {
    const tweet = await this.tweetService.readTweetById(tweetId);
    return tweet;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/readTweetByUser')
  async readTweetByUser(@Body('userId') userId: string) {
    const tweet = await this.tweetService.readTweetByUser(userId);
    return tweet;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/delete')
  async deleteTweet(@Body() body: { userId: string; tweetId: string }) {
    const deleted = await this.tweetService.deleteTweet(
      body.userId,
      body.tweetId,
    );
    return {
      deleted,
    };
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
