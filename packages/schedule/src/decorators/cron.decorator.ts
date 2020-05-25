import { CronOptions } from '../interfaces/cron-options.interface';

export const CRON_METADATA = Symbol('artisanjs-schedule:cron');

export function getCronMetadata(target: object): CronMetadata[] | undefined {
  return Reflect.getMetadata(CRON_METADATA, target);
}

export function hasCronMetadata(target: object): boolean {
  return Reflect.hasMetadata(CRON_METADATA, target);
}

export function Cron(expression: string, options?: CronOptions): MethodDecorator {
  return (target, propertyKey: string, descriptor) => {
    const value: CronMetadata[] = [...(getCronMetadata(target.constructor) || []), {
      ...options,
      descriptor: descriptor,
      expression: expression,
    }];

    Reflect.defineMetadata(CRON_METADATA, value, target.constructor);
  };
}

export interface CronMetadata extends CronOptions {
  descriptor: TypedPropertyDescriptor<any>;
  expression: string;
}
