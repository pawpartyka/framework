import { isClassProvider, isExistingProvider, isFactoryProvider, Package, Provider } from '@artisanjs/core';
import { BullManager } from './bull.manager';
import { QueueOptions } from './interfaces/queue-options.interface';
import { createNativeQueueProvider } from './providers/native-queue.provider';
import { createQueueOptionsProvider, QueueOptionsProvider } from './providers/queue-options.provider';
import { createQueueProvider } from './providers/queue.provider';

export class BullPackage {
  public static configure(): BullPackage {
    return new BullPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      BullManager,
    ];
  }

  public declareQueue(name: string, options: QueueOptions | QueueOptionsProvider = {}): this {
    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createQueueOptionsProvider(name, options));
    } else {
      this.providers.push(createQueueOptionsProvider(name, { useFactory: () => options as QueueOptions }));
    }

    this.providers.push(createNativeQueueProvider(name));
    this.providers.push(createQueueProvider(name));

    return this;
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
