import { Module } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketSchema } from './market.model';
import { UserSchema } from '../users/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'market', schema: MarketSchema }]),
  ],
  providers: [MarketService],
  controllers: [MarketController],
  exports: [MarketService],
})
export class MarketModule {}
