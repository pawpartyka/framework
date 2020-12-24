import { TestingLogger } from './testing-logger';
import { Token } from './types/token';
import { Type } from './types/type';
import { Dependency, Provider } from './types/provider';
import { ApplicationBuilder, ApplicationBuilderOptions } from './application-builder';

export class TestingApplicationBuilder extends ApplicationBuilder {
  constructor(options: TestingApplicationBuilderOptions) {
    super({ packages: options.packages, providers: options.providers });

    super.useLogger(TestingLogger);
  }

  public overrideProvider(token: Token): OverrideBy<TestingApplicationBuilder> {
    return {
      useClass: (type: Type) => {
        return this.override(token, { provide: token, useClass: type });
      },
      useFactory: (options: OverrideByFactoryOptions) => {
        return this.override(token, { provide: token, useFactory: options.factory, dependencies: options.dependencies });
      },
      useValue: (value: any) => {
        return this.override(token, { provide: token, useValue: value });
      },
    };
  }

  protected override(token: Token, provider: Provider): TestingApplicationBuilder {
    this.providers.set(token, provider);

    return this;
  }
}

export interface OverrideBy<T> {
  useClass: (type: Type) => T;
  useFactory: (options: OverrideByFactoryOptions) => T;
  useValue: (value: any) => T;
}

export interface OverrideByFactoryOptions {
  dependencies?: (Token | Dependency)[];
  factory: (...args: any[]) => any;
}

export type TestingApplicationBuilderOptions = ApplicationBuilderOptions;
