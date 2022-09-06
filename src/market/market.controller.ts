import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { MarketService } from './market.service';
import { UserPayloadToServer } from './market.dto';

@Controller('market')
export class MarketController {
  constructor(public marketService: MarketService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('/user_action')
  async user_action(@Body() body: UserPayloadToServer) {
    const response = await this.marketService.userAction_onStock(
      body.userId,
      body.company_name,
      body.action,
      body.quantity,
    );

    console.log('received body');
    console.log({ body });
    return response;
  }

  // @Post('/testt')
  // testt(@Body() body: any) {
  //   this.marketService.testt(body);
  // }
}
