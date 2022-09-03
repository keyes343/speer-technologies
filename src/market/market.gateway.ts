import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MarketService } from './market.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class MarketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private marketService: MarketService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  handleConnection(client: any, ...args: any[]) {
    console.log('connection established');
    return {
      msg: 'connection established',
    };
  }

  handleDisconnect(client: any) {
    console.log('disconnected');
    return {
      msg: 'disconnected',
    };
  }

  afterInit(server: any) {
    console.log('connection initiated ... all good');
    return {
      msg: 'connection initiated ... all good',
    };
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: string): string {
    return 'Hello world!';
  }
}
