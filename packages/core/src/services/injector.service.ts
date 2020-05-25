import { Application } from '../application';
import { Inject } from '../decorators/inject.decorator';
import { Injectable } from '../decorators/injectable.decorator';
import { Provider } from '../interfaces/provider.interface';
import { Token } from '../interfaces/token.interface';
import { APP_REFERENCE } from '../tokens/app-reference.token';

@Injectable()
export class Injector {
  constructor(@Inject(APP_REFERENCE) private readonly application: Application) {
  }

  public async filter(fn: (provider: Provider) => boolean): Promise<any[]> {
    return await this.application.filter(fn);
  }

  public async find<T = any>(token: Token<T>, defaultValue?: any): Promise<T> {
    return await this.application.find(token, defaultValue);
  }
}
