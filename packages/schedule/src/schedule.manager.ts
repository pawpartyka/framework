import { Injectable, Injector, Logger, OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '@artisanjs/core';
import { CronJob as Job } from 'cron';
import { getCronMetadata, hasCronMetadata } from './decorators/cron.decorator';

@Injectable()
export class ScheduleManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  protected readonly jobs: Job[] = [];

  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    for (const instance of await this.injector.filter(it => hasCronMetadata(it))) {
      for (const meta of getCronMetadata(instance.constructor) || []) {
        this.jobs.push(
          new Job(meta.expression, meta.descriptor.value.bind(instance), null, false, meta.timeZone, null, false, meta.utcOffset, meta.unrefTimeout),
        );

        this.logger.info(`Mapped {${ meta.expression }} CRON job`);
      }
    }
  }

  public async onApplicationListen(): Promise<void> {
    this.logger.log('Starting schedule...');

    this.jobs.forEach(it => it.start());
  }

  public async onApplicationShutdown(): Promise<void> {
    this.logger.log(`Stopping schedule...`);

    this.jobs.forEach(it => it.stop());
  }
}
