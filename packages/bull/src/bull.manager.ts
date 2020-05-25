import { Injectable, Injector, Logger, OnApplicationListen } from '@artisanjs/core';
import { getBullProcessMetadata, hasBullProcessMetadata } from './decorators/bull-process.decorator';
import { getBullQueueOnMetadata, hasBullQueueOnMetadata } from './decorators/bull-queue-on.decorator';
import { Queue } from './interfaces/queue.interface';
import { getQueueToken } from './providers/queue.provider';

@Injectable()
export class BullManager implements OnApplicationListen {
  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
  ) {
  }

  public async onApplicationListen(): Promise<void> {
    const instances: any[] = await this.injector.filter(it => {
      return hasBullProcessMetadata(it) || hasBullQueueOnMetadata(it);
    });

    for (const instance of instances) {
      for (const meta of (getBullQueueOnMetadata(instance.constructor) || [])) {
        const queue: Queue = await this.injector.find(getQueueToken(meta.queue));

        queue.on(meta.event, meta.descriptor.value.bind(instance));
      }

      for (const meta of (getBullProcessMetadata(instance.constructor) || [])) {
        const queue: Queue = await this.injector.find(getQueueToken(meta.queue));

        queue.process(meta.descriptor.value.bind(instance), {
          concurrency: meta.concurrency,
          jobName: meta.jobName,
        });

        this.logger.info(`Queue processor for '${ meta.queue }' has been activated`);
      }
    }
  }
}
