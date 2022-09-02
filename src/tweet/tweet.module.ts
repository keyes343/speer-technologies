import { Module } from '@nestjs/common';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { TweetSchema } from './tweet.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { UserSchema } from '../users/users.model';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'tweet', schema: TweetSchema }]),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
  ],
  controllers: [TweetController],
  providers: [TweetService],
  exports: [TweetService],
})
export class TweetModule {}
