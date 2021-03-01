import { Injectable, Injector, isTypeProvider, Logger, LoggerFactory, OnApplicationInit, OnApplicationListen, OnApplicationShutdown } from '@artisanjs/core';
import { SCHEDULED_METADATA, ScheduledMetadata } from './decorators/scheduled';
import { Schedule } from './services/schedule';
import { Job } from './adapters/job';

@Injectable()
export class ScheduleManager implements OnApplicationInit, OnApplicationListen, OnApplicationShutdown {
  protected readonly logger: Logger = LoggerFactory.getLogger(ScheduleManager.name);

  constructor(private readonly injector: Injector,
              private readonly schedule: Schedule) {
  }

  public async onApplicationInit(): Promise<void> {
    const instances = await this
      .injector
      .filter(provider => {
        if (!isTypeProvider(provider)) {
          return false;
        }

        return Object
          .values(Object.getOwnPropertyDescriptors(provider.prototype))
          .some(descriptor => {
            return typeof descriptor.value === 'function' && Reflect.hasMetadata(SCHEDULED_METADATA, descriptor.value);
          });
      });

    for (const instance of instances) {
      for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(instance)))) {
        for (const meta of (Reflect.getMetadata(SCHEDULED_METADATA, descriptor.value) || []) as ScheduledMetadata) {
          const name = meta.name || Math.floor(Date.now() * Math.random()).toString(36);

          this.schedule.push(new Job({
            callback: descriptor.value.bind(instance),
            expression: meta.expression,
            name: name,
            timeZone: meta.timeZone,
            unrefTimeout: meta.unrefTimeout,
            utcOffset: meta.utcOffset,
          }));

          this.logger.info(`Mapped {${ meta.expression }} schedule job`);
        }
      }
    }
  }

  public async onApplicationListen(): Promise<void> {
    this.logger.info('Starting schedule...');

    this.schedule.forEach(job => job.start());
  }

  public async onApplicationShutdown(): Promise<void> {
    this.logger.info(`Stopping schedule...`);

    this.schedule.forEach(job => job.stop());
  }
}
