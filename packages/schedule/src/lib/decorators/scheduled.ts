export const SCHEDULED_METADATA = Symbol('SCHEDULED');

export function Scheduled(expression: string, options?: ScheduledOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const meta: ScheduledMetadata = Reflect.getMetadata(SCHEDULED_METADATA, descriptor.value) || [];

    meta.push({ ...options || {}, expression: expression });

    Reflect.defineMetadata(SCHEDULED_METADATA, meta, descriptor.value);
  };
}

export interface ScheduledOptions {
  name?: string;
  timeZone?: string;
  unrefTimeout?: boolean;
  utcOffset?: string | number;
}

export type ScheduledMetadata = Array<{ expression: string } & ScheduledOptions>;
