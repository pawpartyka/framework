import { ProcessOptions as BullProcessOptions } from '../interfaces/queue.interface';

export const BULL_PROCESS_METADATA = Symbol('artisanjs-bull:bull-process');

export function getBullProcessMetadata(target: object): BullProcessMetadata[] | undefined {
  return Reflect.getMetadata(BULL_PROCESS_METADATA, target);
}

export function hasBullProcessMetadata(target: object): boolean {
  return Reflect.hasMetadata(BULL_PROCESS_METADATA, target);
}

export function BullProcess(queue: string, options?: BullProcessOptions): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    const value: BullProcessMetadata[] = [...(getBullProcessMetadata(target.constructor) || []), {
      ...options,
      descriptor: descriptor,
      queue: queue,
    }];

    Reflect.defineMetadata(BULL_PROCESS_METADATA, value, target.constructor);
  };
}

export interface BullProcessMetadata extends BullProcessOptions {
  descriptor: TypedPropertyDescriptor<any>;
  queue: string;
}
