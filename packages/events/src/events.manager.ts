import { Injectable, Injector, Logger, OnApplicationBoot } from '@artisanjs/core';
import { getOnEventMetadata, hasOnEventMetadata } from './decorators/on-event.decorator';
import { Registry } from './services/registry.service';

@Injectable()
export class EventsManager implements OnApplicationBoot {
  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
    private readonly registry: Registry,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    for (const instance of await this.injector.filter(it => hasOnEventMetadata(it))) {
      for (const meta of getOnEventMetadata(instance.constructor) || []) {
        this.registry.push({
          event: meta.event,
          handler: meta.descriptor.value.bind(instance),
        });

        this.logger.info(`Mapped event handler for {${ meta.event }}`);
      }
    }
  }
}
