import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/users.model';
import { Tweet } from './tweet.model';

@Injectable()
export class TweetService {
  constructor(
    @InjectModel('tweet') private readonly tweetModel: Model<Tweet>,
    @InjectModel('user') private readonly userModel: Model<User>,
  ) {}

  async createTweet(userId: string, username: string, tweet: string) {
    const newTweet = new this.tweetModel({
      userId,
      username,
      tweet,
      likes: 0,
    });
    await newTweet.save();
    return newTweet;
  }

  async updateTweet(userId: string, tweetId: string, tweet: string) {
    const fetchTweet = await this.tweetModel.findById(tweetId);
    // check if tweet exist
    if (!fetchTweet) {
      return {
        msg: `no tweet with this id exists - ${tweetId}`,
      };
    }

    // check if tweet belongs to this user
    if (fetchTweet.userId.toString() !== userId) {
      return {
        msg: `tweet doesnt belong to this user - ${userId}`,
      };
    }

    const updatedTweet = await fetchTweet.update({
      tweet,
    });
    return updatedTweet;
  }
}
