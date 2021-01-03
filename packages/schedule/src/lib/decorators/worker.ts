export const WORKER_METADATA = Symbol('WORKER');

export function Worker(expression: string, options?: WorkerOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const meta: WorkerMetadata = Reflect.getMetadata(WORKER_METADATA, descriptor.value) || [];

    meta.push({ ...options, expression: expression });

    Reflect.defineMetadata(WORKER_METADATA, meta, descriptor.value);
  };
}

export interface WorkerOptions {
  timeZone?: string;
  unrefTimeout?: boolean;
  utcOffset?: string | number;
}

export type WorkerMetadata = Array<{ expression: string } & WorkerOptions>;
