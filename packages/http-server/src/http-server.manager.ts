import { Inject, Injectable, Logger, OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from '@artisanjs/core';
import { Instance as HttpRouter } from 'find-my-way';
import * as http from 'http';
import * as mime from 'mime-types';
import { serializeError } from 'serialize-error';
import { createRequestAdapter } from './adapters/request.adapter';
import { createResponseAdapter } from './adapters/response.adapter';
import { HttpException } from './exceptions/http.exception';
import { HttpServerPackageOptions } from './interfaces/http-server-package-options.interface';
import { Request } from './interfaces/request.interface';
import { Response } from './interfaces/response.interface';
import { HTTP_ROUTER } from './providers/http-router.provider';
import { HttpRoute, HTTP_ROUTES } from './providers/http-routes.provider';
import { HTTP_SERVER_PACKAGE_OPTIONS } from './providers/http-server-package-options.provider';
import { HTTP_SERVER } from './providers/http-server.provider';

@Injectable()
export class HttpServerManager implements OnApplicationBoot, OnApplicationListen, OnApplicationShutdown {
  constructor(
    @Inject(HTTP_ROUTER) private readonly httpRouter: HttpRouter<any>,
    @Inject(HTTP_ROUTES) private readonly httpRoutes: HttpRoute[],
    @Inject(HTTP_SERVER) private readonly httpServer: http.Server,
    @Inject(HTTP_SERVER_PACKAGE_OPTIONS) private readonly httpServerPackageOptions: HttpServerPackageOptions,
    private readonly logger: Logger,
  ) {
  }

  public async onApplicationBoot(): Promise<void> {
    for (const httpRoute of this.httpRoutes) {
      this.httpRouter.on(httpRoute.method.toUpperCase() as any, httpRoute.path, async (req: http.IncomingMessage, res: http.ServerResponse, params) => {
        try {
          const request: Request = await createRequestAdapter(req, params);
          const response: Response = await createResponseAdapter(req, res);

          return await httpRoute.handler(request, response);
        } catch (error) {
          return res
            .writeHead(error instanceof HttpException ? error.getStatus() : 500, {
              'Content-Type': mime.contentType('json') as string,
            })
            .end(JSON.stringify(error instanceof HttpException ? error.getResponse() : serializeError(error)));
        }
      });

      this.logger.info(`Mapped {${ httpRoute.path }, ${ httpRoute.method.toUpperCase() }} HTTP route`);
    }
  }

  public async onApplicationListen(): Promise<void> {
    const port: number = this.httpServerPackageOptions.port || 8080;

    this.httpServer.listen(port, () => {
      this.logger.info(`Http server listening at port ${ port }`);
    });
  }

  public async onApplicationShutdown(signal: string): Promise<void> {
    this.httpServer.close(() => {
      this.logger.info('Http server has been stopped');
    });
  }
}
