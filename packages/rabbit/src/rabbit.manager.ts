import { Injectable, Injector, Logger, OnApplicationListen } from '@artisanjs/core';
import { getRabbitChannelOnMetadata, hasRabbitChannelOnMetadata } from './decorators/rabbit-channel-on.decorator';
import { getRabbitConnectionOnMetadata, hasRabbitConnectionOnMetadata } from './decorators/rabbit-connection-on.decorator';
import { getRabbitConsumerMetadata, hasRabbitConsumerMetadata } from './decorators/rabbit-consumer.decorator';
import { Channel } from './interfaces/channel.interface';
import { ConfirmChannel } from './interfaces/confirm-channel.interface';
import { Connection } from './interfaces/connection.interface';
import { Queue } from './interfaces/queue.interface';
import { getChannelToken } from './providers/channel.provider';
import { getConnectionToken } from './providers/connection.provider';
import { getQueueToken } from './providers/queue.provider';

@Injectable()
export class RabbitManager implements OnApplicationListen {
  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
  ) {
  }

  public async onApplicationListen(): Promise<void> {
    const instances: any[] = await this.injector.filter(it => {
      return hasRabbitChannelOnMetadata(it) || hasRabbitConnectionOnMetadata(it) || hasRabbitConsumerMetadata(it);
    });

    for (const instance of instances) {
      for (const meta of (getRabbitConnectionOnMetadata(instance.constructor) || [])) {
        const connection = await this.injector.find<Connection>(getConnectionToken(meta.connection));

        connection.on(meta.event, meta.descriptor.value.bind(instance));
      }

      for (const meta of (getRabbitChannelOnMetadata(instance.constructor) || [])) {
        const channel = await this.injector.find<Channel | ConfirmChannel>(getChannelToken(meta.channel));

        channel.on(meta.event, meta.descriptor.value.bind(instance));
      }
    }

    for (const instance of instances) {
      for (const meta of (getRabbitConsumerMetadata(instance.constructor) || [])) {
        const queue = await this.injector.find<Queue>(getQueueToken(meta.queue));
        const result = await queue.consume(message => meta.descriptor.value.call(instance, message), {
          arguments: meta.arguments,
          consumerTag: meta.consumerTag,
          exclusive: meta.exclusive,
          noAck: meta.noAck,
          noLocal: meta.noLocal,
          priority: meta.priority,
        });

        this.logger.info(`Queue consumer with tag '${ result.consumerTag }' has been activated`);
      }
    }
  }
}
