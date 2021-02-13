import { Injectable } from '@artisanjs/core';
import matcher from 'matcher';
import { EventsRegistry } from './events-registry';

@Injectable()
export class Emitter {
  constructor(private readonly eventsRegistry: EventsRegistry) {
  }

  public emit(event: string, data: any): void {
    this
      .eventsRegistry
      .filter(it => matcher.isMatch(event, it.event))
      .forEach(it => it.handler(data));
  }
}
