import { Injector } from './injector';
import { isTypeProvider } from './utils/is-type-provider';
import { isClassProvider } from './utils/is-class-provider';
import { OnApplicationShutdown } from './types/hooks';
import * as http from 'http';
import { Method } from './types/method';
import { Path } from './types/path';

export class Router {
  protected routes: Route[] = [];

  constructor(
    private readonly logger: Logger,
  ) {
  }

  public route(method: Method, path: Path, handler: Handler): Router {
    if (!path.startsWith('/')) {
      throw new Error(`The first character of a path should be '/'`);
    }

    const matcher = match(path);

    if (this.routes.some(it => it.method === method && matcher(it.path))) {
      throw new Error(`Duplicated {${ path }, ${ method }} HTTP route`);
    }

    this.routes.push({ method, path, handler });

    this.logger.trace(`Mapped {${ path }, ${ method }} HTTP route`);

    return this;
  }
}

export interface Handler {
  (context: Context): any;
}

export interface Route {
  handler: Handler;
  method: Method;
  path: Path;
}
