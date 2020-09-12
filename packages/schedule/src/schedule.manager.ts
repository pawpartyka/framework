import { Injectable, Injector, Logger, OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '@artisanjs/core';
import { CronJob } from 'cron';
import { getCronMetadata, hasCronMetadata } from './decorators/cron.decorator';
import { Registry } from './services/registry.service';

@Injectable()
export class ScheduleManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
    private readonly registry: Registry,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    for (const instance of await this.injector.filter(it => hasCronMetadata(it))) {
      for (const meta of getCronMetadata(instance.constructor) || []) {
        this.registry.push(
          new CronJob(meta.expression, meta.descriptor.value.bind(instance), null, false, meta.timeZone, null, false, meta.utcOffset, meta.unrefTimeout),
        );

        this.logger.info(`Mapped {${ meta.expression }} CRON job`);
      }
    }
  }

  public async onApplicationListen(): Promise<void> {
    this.logger.info('Starting schedule...');

    this.registry.forEach(it => it.start());
  }

  public async onApplicationShutdown(): Promise<void> {
    this.logger.info(`Stopping schedule...`);

    this.registry.forEach(it => it.stop());
  }
}
