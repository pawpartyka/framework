import { ApplicationBuilder, Logger, OverrideBy, Package, Provider, Token } from '@artisanjs/core';
import { TestingLogger } from '../services/testing-logger.service';

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
