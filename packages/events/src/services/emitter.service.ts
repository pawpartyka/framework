import { Injectable, Injector, Logger, OnApplicationBoot } from '@artisanjs/core';
import matcher from 'matcher';
import { getOnEventMetadata, hasOnEventMetadata } from '../decorators/on-event.decorator';

@Injectable()
export class Emitter implements OnApplicationBoot {
  private readonly registry: { event: string, handlers: any[] }[] = [];

  constructor(
    private readonly injector: Injector,
    private readonly logger: Logger,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    for (const instance of await this.injector.filter(it => hasOnEventMetadata(it))) {
      for (const meta of getOnEventMetadata(instance.constructor) || []) {
        let registry = this.registry.find(it => {
          return matcher.isMatch(meta.event, it.event);
        });

        if (!registry) {
          this.registry.push(registry = {
            event: meta.event,
            handlers: [],
          });
        }

        registry.handlers.push(meta.descriptor.value.bind(instance));

        this.logger.info(`Mapped event handler for {${ meta.event }}`);
      }
    }
  }

  public emit(event: string, data: any): void {
    const registry = this.registry.find(it => {
      return matcher.isMatch(event, it.event);
    });

    if (registry) {
      for (const handler of registry.handlers) {
        handler(data);
      }
    }
  }
}
