import { Injectable } from '@artisanjs/core';
import ws from 'ws';
import { Registry } from './registry.service';

@Injectable()
export class Emitter {
  constructor(private readonly registry: Registry) {
  }

  public broadcast(path: string, event: string, data: any): void {
    const wss: ws.Server = this.registry.get(path);

    for (const client of wss?.clients || []) {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ event, data }));
      }
    }
  }
}
