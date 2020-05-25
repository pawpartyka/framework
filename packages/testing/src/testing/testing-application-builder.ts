import { ApplicationBuilder, OverrideBy, Package, Provider, Token } from '@artisanjs/core';

export class TestingApplicationBuilder extends ApplicationBuilder {
  constructor(options: TestingApplicationBuilderOptions) {
    super({ packages: options.packages, providers: options.providers });
  }

  public overrideProvider(token: Token): OverrideBy<this> {
    return super.overrideProvider(token);
  }
}

export interface TestingApplicationBuilderOptions {
  packages?: Package[];
  providers?: Provider[];
}
