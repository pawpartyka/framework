import { Injectable, Injector, Logger, OnApplicationBoot } from '@artisanjs/core';
import matcher from 'matcher';
import { getOnEventMetadata, hasOnEventMetadata } from './decorators/on-event.decorator';

@Injectable()
export class EventsManager implements OnApplicationBoot {
  private readonly registry: { event: string, handler: (...args: any[]) => any }[] = [];

  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
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

  public emit(event: string, data: any): void {
    this
      .registry
      .filter(it => matcher.isMatch(event, it.event))
      .forEach(it => it.handler(data));
  }
}
