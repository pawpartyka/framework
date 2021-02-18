import { Package, Provider } from '@artisanjs/core';
import { EventEmitterManager } from './event-emitter-manager';
import { Emitter } from './services/emitter';
import { EventsRegistry } from './services/events-registry';

export class EventEmitterPackage {
  public static configure(): EventEmitterPackage {
    return new EventEmitterPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      Emitter,
      EventEmitterManager,
      EventsRegistry,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
