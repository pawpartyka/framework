import { TestingLogger } from './testing-logger';
import { ApplicationBuilder, OverrideBy, Package } from '../application-builder';
import { Logger } from '../logger';
import { Provider, Token } from '../utils';

export class TestingApplicationBuilder extends ApplicationBuilder {
  constructor(options: TestingApplicationBuilderOptions) {
    super({ packages: options.packages, providers: options.providers });

    this
      .overrideProvider(Logger)
      .useClass(TestingLogger);
  }

  public overrideProvider(token: Token): OverrideBy<this> {
    return super.overrideProvider(token);
  }
}

export interface TestingApplicationBuilderOptions {
  packages?: Package[];
  providers?: Provider[];
}
