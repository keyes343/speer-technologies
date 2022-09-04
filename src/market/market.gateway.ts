import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { forwardRef, Injectable, Logger, Inject } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { MarketService } from './market.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class MarketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => MarketService))
    private marketService: MarketService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  handleConnection(client: any, ...args: any[]) {
    this.logger.log('connection established');
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
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): string {
    // handleMessage(client: Socket, payload: string): string {

    console.log({ data });
    // this.server.emit('messageToClient', data);

    return 'Hello world!';
  }
}
