import { Package, Provider } from '@artisanjs/core';
import { EventsManager } from './events.manager';
import { Emitter } from './services/emitter.service';
import { Registry } from './services/registry.service';

const BUILT_IN_MANAGERS: Provider[] = [
  EventsManager,
];

const BUILT_IN_SERVICES: Provider[] = [
  Emitter,
  Registry,
];

export class EventsPackage {
  public static configure(): EventsPackage {
    return new EventsPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      ...BUILT_IN_MANAGERS,
      ...BUILT_IN_SERVICES,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
