import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TweetModule } from './tweet/tweet.module';
import { TweetController } from './tweet/tweet.controller';
import { MarketModule } from './market/market.module';
import { MarketGateway } from './market/market.gateway';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://speer:speer@cluster0.vh99l.mongodb.net/speer?retryWrites=true&w=majority`,
    ),
    UsersModule,
    AuthModule,
    TweetModule,
    MarketModule,
  ],
  controllers: [AppController],
  providers: [AppService, MarketGateway],
})
export class AppModule {}
