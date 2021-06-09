import { Injector } from './injector';
import { isTypeProvider } from './utils/is-type-provider';
import { isClassProvider } from './utils/is-class-provider';
import { OnApplicationShutdown } from './types/hooks';
import * as http from 'http';
import { Method } from './types/method';
import { Path } from './types/path';

export class Application {
  protected routes: Route[] = [];

  constructor(
    protected readonly injector: Injector,
  ) {
  }

  public handle(request: http.IncomingMessage, response: http.ServerResponse): void {

  }

  public async shutdown(signal?: string): Promise<void> {
    for (const provider of await this.injector.filter(token => isTypeProvider(token) || isClassProvider(token))) {
      if (typeof (provider as OnApplicationShutdown).onApplicationShutdown === 'function') {
        await provider.onApplicationShutdown(signal);
      }
    }
  }
}

export interface Route {
  handler: Handler;
  method: Method;
  path: Path;
}
