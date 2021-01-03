import { Injectable, Injector, isTypeProvider, Logger, LoggerFactory, OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '@artisanjs/core';
import { CronJob } from 'cron';
import { WORKER_METADATA, WorkerMetadata } from './decorators/worker';

@Injectable()
export class ScheduleManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  protected readonly logger: Logger = LoggerFactory.getLogger(ScheduleManager.name);
  protected readonly workers: CronJob[] = [];

  constructor(private readonly injector: Injector) {
  }

  public async onApplicationBoot(): Promise<void> {
    const instances = await this
      .injector
      .filter(provider => {
        if (!isTypeProvider(provider)) {
          return false;
        }

        return Object
          .values(Object.getOwnPropertyDescriptors(provider.prototype))
          .some(descriptor => {
            return typeof descriptor.value === 'function' && Reflect.hasMetadata(WORKER_METADATA, descriptor.value);
          });
      });

    for (const instance of instances) {
      for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(instance)))) {
        for (const meta of (Reflect.getMetadata(WORKER_METADATA, descriptor.value) || []) as WorkerMetadata) {
          this.workers.push(
            new CronJob(meta.expression, descriptor.value, null, false, meta.timeZone, instance, false, meta.utcOffset, meta.unrefTimeout),
          );

          this.logger.info(`Mapped {${ meta.expression }} CRON job`);
        }
      }
    }
  }

  public async onApplicationListen(): Promise<void> {
    this.logger.info('Starting schedule...');

    this.workers.forEach(it => it.start());
  }

  public async onApplicationShutdown(): Promise<void> {
    this.logger.info(`Stopping schedule...`);

    this.workers.forEach(it => it.stop());
  }
}
