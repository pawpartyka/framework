import { Injectable, Injector, isTypeProvider, Logger, LoggerFactory, OnApplicationInit } from '@artisanjs/core';
import { EventsRegistry } from './services/events-registry';
import { ON_EVENT_METADATA, OnEventMetadata } from './decorators/on-event';

@Injectable()
export class EventsManager implements OnApplicationInit {
  protected readonly logger: Logger = LoggerFactory.getLogger(EventsManager.name);

  constructor(private readonly eventsRegistry: EventsRegistry,
              private readonly injector: Injector) {
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
            return typeof descriptor.value === 'function' && Reflect.hasMetadata(ON_EVENT_METADATA, descriptor.value);
          });
      });

    for (const instance of instances) {
      for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(instance)))) {
        for (const meta of (Reflect.getMetadata(ON_EVENT_METADATA, descriptor.value) || []) as OnEventMetadata) {
          this.eventsRegistry.push({
            event: meta.event,
            handler: data => descriptor.value.call(instance, data),
          });

          this.logger.info(`Mapped {${ meta.event }} event handler`);
        }
      }
    }
  }
}
