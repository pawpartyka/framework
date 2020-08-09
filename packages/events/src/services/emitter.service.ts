import { Inject, Injectable } from '@artisanjs/core';
import { EventsManager } from '../events.manager';

@Injectable()
export class Emitter {
  constructor(
    private readonly eventsManager: EventsManager,
  ) {
  }

  public emit(event: string, data: any): void {
    this.eventsManager.emit(event, data);
  }
}
