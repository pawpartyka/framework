import { ConsumeOptions as RabbitConsumerOptions } from '../interfaces/queue.interface';

export const RABBIT_CONSUMER_METADATA = Symbol('artisanjs-rabbit:rabbit-consumer');

export function getRabbitConsumerMetadata(target: object): RabbitConsumerMetadata[] | undefined {
  return Reflect.getMetadata(RABBIT_CONSUMER_METADATA, target);
}

export function hasRabbitConsumerMetadata(target: object): boolean {
  return Reflect.hasMetadata(RABBIT_CONSUMER_METADATA, target);
}

export function RabbitConsumer(queue: string, options?: RabbitConsumerOptions): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    const value: RabbitConsumerMetadata[] = [...(getRabbitConsumerMetadata(target.constructor) || []), {
      ...options,
      descriptor: descriptor,
      queue: queue,
    }];

    Reflect.defineMetadata(RABBIT_CONSUMER_METADATA, value, target.constructor);
  };
}

export interface RabbitConsumerMetadata extends RabbitConsumerOptions {
  descriptor: TypedPropertyDescriptor<any>;
  queue: string;
}
