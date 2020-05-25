import { ConnectionEvent } from '../enums/connection-event.enum';

export const RABBIT_CONNECTION_ON_METADATA = Symbol('artisanjs-rabbit:rabbit-connection-on');

export function getRabbitConnectionOnMetadata(target: object): RabbitConnectionOnMetadata[] | undefined {
  return Reflect.getMetadata(RABBIT_CONNECTION_ON_METADATA, target);
}

export function hasRabbitConnectionOnMetadata(target: object): boolean {
  return Reflect.hasMetadata(RABBIT_CONNECTION_ON_METADATA, target);
}

export function RabbitConnectionOn(event: ConnectionEvent, connection: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    const value: RabbitConnectionOnMetadata[] = [...(getRabbitConnectionOnMetadata(target.constructor) || []), {
      connection: connection,
      descriptor: descriptor,
      event: event,
    }];

    Reflect.defineMetadata(RABBIT_CONNECTION_ON_METADATA, value, target.constructor);
  };
}

export interface RabbitConnectionOnMetadata {
  connection: string;
  descriptor: TypedPropertyDescriptor<any>;
  event: ConnectionEvent;
}
