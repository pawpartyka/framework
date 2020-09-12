import { Package, Provider } from '@artisanjs/core';
import { ScheduleManager } from './schedule.manager';
import { Registry } from './services/registry.service';

const BUILT_IN_MANAGERS: Provider[] = [
  ScheduleManager,
];

const BUILT_IN_SERVICES: Provider[] = [
  Registry,
];

export class SchedulePackage {
  public static configure(): SchedulePackage {
    return new SchedulePackage();
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
