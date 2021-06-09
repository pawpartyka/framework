import 'reflect-metadata';

// todo@
import http from 'http';
import { Controller } from './lib/__http-server/decorators/controller';
import { Injectable } from './lib/decorators/injectable';
import { Get } from './lib/__http-server/decorators/request-mapping';
import { bootstrap } from './lib/bootstrap';
import { Application } from './lib/application';

@Injectable()
class Service {
}

@Controller()
class UserController {
  constructor(private service: Service) {
  }

  @Get('/users')
  public users(request: http.IncomingMessage, response: http.ServerResponse) {
    response.setHeader('Content-Type', 'application/json');
    response.end('{ siema: 1 }');
  }
}

export async function createServer(): Promise<http.Server> {
  const application: Application = await bootstrap({
    packages: [
      // ...
    ],
    providers: [
      Service,
      UserController,
    ],
  });

  process.on('SIGINT', () => {
    application.shutdown('SIGINT');
  });

  return http.createServer((req, res) => application.handle(req, res));
}
