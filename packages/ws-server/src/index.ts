import { Application, ArtisanFactory, Injectable, OnApplicationInit } from '@artisanjs/core';
import { Channel } from './decorators/channel.decorator';
import { Subscribe } from './decorators/subscribe.decorator';
import { Client } from './interfaces/client.interface';
import { OnChannelConnection } from './interfaces/on-channel-connection.interface';
import { OnChannelDestroy } from './interfaces/on-channel-destroy.interface';
import { OnChannelDisconnect } from './interfaces/on-channel-disconnect.interface';
import { OnChannelInit } from './interfaces/on-channel-init.interface';
import { Emitter } from './services/emitter.service';
import { WsServerPackage } from './ws-server.package';

@Channel('/chat/:id', { interceptors: [] })
export class ChatWithIdChannel implements OnChannelInit, OnChannelConnection, OnChannelDisconnect, OnChannelDestroy {
  public async onChannelInit(params: { [name: string]: string; }): Promise<void> {
    console.log('onChannelInit with id, params: ', params);
  }

  public async onChannelConnection(client: Client): Promise<void> {
    console.log('onChannelConnection with id');
  }

  public async onChannelDisconnect(client: Client): Promise<void> {
    console.log('onChannelDisconnect with id');
  }

  public async onChannelDestroy(params: { [name: string]: string; }): Promise<void> {
    console.log('onChannelDestroy with id, params: ', params);
  }
}

@Channel('/chat', { interceptors: [] })
export class ChatChannel implements OnChannelInit, OnChannelConnection, OnChannelDisconnect, OnChannelDestroy {
  constructor(private readonly emitter: Emitter) {
  }

  public async onChannelInit(params: { [name: string]: string; }): Promise<void> {
    console.log('onChannelInit, params: ', params);
  }

  public async onChannelConnection(client: Client): Promise<void> {
    console.log('onChannelConnection');
  }

  public async onChannelDisconnect(client: Client): Promise<void> {
    console.log('onChannelDisconnect');
  }

  public async onChannelDestroy(params: { [name: string]: string; }): Promise<void> {
    console.log('onChannelDestroy');
  }

  // sendToRoom should be unique !!
  @Subscribe('sendToRoom', { interceptors: [] })
  public onSendToRoom(client: Client, data: any): void { // Socket or Client?
    console.log('onSendToRoom: ', data);
    // socket.emit('event', 'data');

    this.emitter.broadcast('/chat', 'test', { a: 1 });
  }

  @Subscribe('joinRoom', { interceptors: [] })
  public joinRoom(client: Client, data: any): void {
    console.log('joinRoom: ', data);
    // this.rooms.find(it => it.roomId === data.roomId).clients.push(socket);
  }

  @Subscribe('leaveRoom', { interceptors: [] })
  public leaveRoom(client: Client, data: any): void {
    console.log('leaveRoom: ', data);
    // const room = this.rooms.find(it => it.roomId === data.roomId);
    // room.clients.slice(room.clients.indexOf(it => it.clientId === socket.clientId), 1);
  }
}

@Injectable()
export class ExampleController implements OnApplicationInit {
  constructor(private readonly emitter: Emitter) {
  }

  public onApplicationInit(): void {
    this.emitter.broadcast('/chat', 'test', { a: 1 }); // przydatne np w POST /new-idea (gdzie chcemy wysłać info do wszystkich klientów połączonych)
  }
}

(async (): Promise<void> => {
  const application: Application = await ArtisanFactory
    .configureApplication({
      packages: [
        WsServerPackage
          .configure({
            interceptors: [],
          })
          .register(),
      ],
      providers: [
        ChatWithIdChannel,
        ChatChannel,
        ExampleController,
      ],
    })
    .compile();

  await application.listen();
})();
