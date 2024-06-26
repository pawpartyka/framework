import { Package, Provider } from '@artisanjs/core';
import { ScheduleManager } from './schedule-manager';
import { Schedule } from './services/schedule';

export class SchedulePackage {
  public static configure(): SchedulePackage {
    return new SchedulePackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      Schedule,
      ScheduleManager,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
