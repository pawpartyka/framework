import { Package, Provider } from '@artisanjs/core';
import { EventsManager } from './events.manager';
import { Emitter } from './services/emitter.service';

export class EventsPackage {
  public static configure(): EventsPackage {
    return new EventsPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      Emitter,
      EventsManager,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
