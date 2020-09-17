import { Inject, Injectable, Injector, Logger, OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '@artisanjs/core';
import http from 'http';
import { match, pathToRegexp } from 'path-to-regexp';
import url from 'url';
import ws from 'ws';
import { getChannelMetadata, hasChannelMetadata } from './decorators/channel.decorator';
import { getSubscribeMetadata } from './decorators/subscribe.decorator';
import { OnChannelConnection } from './interfaces/on-channel-connection.interface';
import { OnChannelDestroy } from './interfaces/on-channel-destroy.interface';
import { OnChannelDisconnect } from './interfaces/on-channel-disconnect.interface';
import { OnChannelInit } from './interfaces/on-channel-init.interface';
import { WsServerPackageOptions } from './interfaces/ws-server-package-options.interface';
import { WS_SERVER_PACKAGE_OPTIONS } from './providers/ws-server-package-options.provider';
import { Registry } from './services/registry.service';

@Injectable()
export class WsServerManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  private readonly server: http.Server = http.createServer();

  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
    private readonly registry: Registry,
    @Inject(WS_SERVER_PACKAGE_OPTIONS) private readonly wsServerPackageOptions: WsServerPackageOptions,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    const channels = await this.injector.filter(it => hasChannelMetadata(it));

    for (const channel of channels) {
      this.logger.info(`Mapped {${ getChannelMetadata(channel.constructor)?.path }} WebSocket channel`);
    }

    this.server.on('upgrade', (request, socket, head) => {
      const pathname = url.parse(request.url).pathname;

      const channel = channels.find(it => pathToRegexp(getChannelMetadata(it.constructor)?.path).test(pathname));

      if (!channel) {
        return socket.destroy();
      }

      const wss: ws.Server = this.registry.get(pathname) || new ws.Server({ noServer: true });

      if (this.registry.has(pathname) === false) {
        this.registry.set(pathname, wss);

        if ((channel as OnChannelInit).onChannelInit) {
          (channel as OnChannelInit).onChannelInit(match(getChannelMetadata(channel.constructor).path)(pathname)['params']);
        }

        wss.on('connection', client => {
          // adapter for client?

          if ((channel as OnChannelConnection).onChannelConnection) {
            (channel as OnChannelConnection).onChannelConnection(client);
          }

          client.on('message', message => {
            const data: { event: string; data: any; } = JSON.parse(message as string);

            getSubscribeMetadata(channel.constructor)
              ?.find(it => it.event === data?.event)
              ?.descriptor
              .value
              .apply(channel, [client, data?.data]);
          });

          client.on('close', () => {
            if ((channel as OnChannelDisconnect).onChannelDisconnect) {
              (channel as OnChannelDisconnect).onChannelDisconnect(client);
            }

            if (wss.clients.size === 0) {
              this.registry.delete(pathname);

              wss.close();

              if ((channel as OnChannelDestroy).onChannelDestroy) {
                (channel as OnChannelDestroy).onChannelDestroy({});
              }
            }
          });
        });
      }

      wss.handleUpgrade(request, socket, head, client => {
        // beforeChannelConnection??? guard?

        wss.emit('connection', client, request);
      });
    });
  }

  public async onApplicationListen(): Promise<void> {
    const port: number = this.wsServerPackageOptions.port || 80;

    this.server.listen(port, () => {
      this.logger.info(`WebSocket server listening at port ${ port }`);
    });
  }

  public async onApplicationShutdown(signal: string): Promise<void> {
    this.server.close(() => {
      this.logger.info('WebSocket server has been stopped');
    });
  }
}
