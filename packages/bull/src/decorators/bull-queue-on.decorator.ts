import { QueueEvent } from '../enums/queue-event.enum';

export const BULL_QUEUE_ON_METADATA = Symbol('artisanjs-bull:bull-queue-on');

export function getBullQueueOnMetadata(target: object): BullQueueOnMetadata[] | undefined {
  return Reflect.getMetadata(BULL_QUEUE_ON_METADATA, target);
}

export function hasBullQueueOnMetadata(target: object): boolean {
  return Reflect.hasMetadata(BULL_QUEUE_ON_METADATA, target);
}

export function BullQueueOn(event: QueueEvent, queue: string): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    const value: BullQueueOnMetadata[] = [...(getBullQueueOnMetadata(target.constructor) || []), {
      descriptor: descriptor,
      event: event,
      queue: queue,
    }];

    Reflect.defineMetadata(BULL_QUEUE_ON_METADATA, value, target.constructor);
  };
}

export interface BullQueueOnMetadata {
  descriptor: TypedPropertyDescriptor<any>;
  event: QueueEvent;
  queue: string;
}
