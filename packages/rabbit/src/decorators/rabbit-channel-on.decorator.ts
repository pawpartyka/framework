import { ChannelEvent } from '../enums/channel-event.enum';

export const RABBIT_CHANNEL_ON_METADATA = Symbol('artisanjs-rabbit:rabbit-channel-on');

export function getRabbitChannelOnMetadata(target: object): RabbitChannelOnMetadata[] | undefined {
  return Reflect.getMetadata(RABBIT_CHANNEL_ON_METADATA, target);
}

export function hasRabbitChannelOnMetadata(target: object): boolean {
  return Reflect.hasMetadata(RABBIT_CHANNEL_ON_METADATA, target);
}

export function RabbitChannelOn(event: ChannelEvent, channel: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    const value: RabbitChannelOnMetadata[] = [...(getRabbitChannelOnMetadata(target.constructor) || []), {
      channel: channel,
      descriptor: descriptor,
      event: event,
    }];

    Reflect.defineMetadata(RABBIT_CHANNEL_ON_METADATA, value, target.constructor);
  };
}

export interface RabbitChannelOnMetadata {
  channel: string;
  descriptor: TypedPropertyDescriptor<any>;
  event: ChannelEvent;
}
