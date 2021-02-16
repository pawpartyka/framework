import { Injectable } from '@artisanjs/core';
import { isMatch } from 'matcher';
import { EventsRegistry } from './events-registry';

@Injectable()
export class Emitter {
  constructor(private readonly eventsRegistry: EventsRegistry) {
  }

  public async emit(event: string, data?: any): Promise<void> {
    for (const { handler } of this.eventsRegistry.filter(it => isMatch(event, it.event))) {
      await handler(data);
    }
  }
}
