import { Injectable } from '@artisanjs/core';
import matcher from 'matcher';
import { Registry } from './registry.service';

@Injectable()
export class Emitter {
  constructor(
    private readonly registry: Registry,
  ) {
  }

  public emit(event: string, data: any): void {
    this
      .registry
      .filter(it => matcher.isMatch(event, it.event))
      .forEach(it => it.handler(data));
  }
}
