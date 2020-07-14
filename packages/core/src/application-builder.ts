import { Application } from './application';
import { isTypeProvider } from './helpers/is-type-provider.helper';
import { Package } from './interfaces/package.interface';
import { Provider } from './interfaces/provider.interface';
import { Token } from './interfaces/token.interface';
import { Type } from './interfaces/type.interface';
import { Injector } from './services/injector.service';
import { Logger } from './services/logger.service';

const BUILT_IN_PROVIDERS: Provider[] = [
  Injector,
  Logger,
];

export class ApplicationBuilder {
  private readonly providers: Provider[];

  constructor(options: ApplicationBuilderOptions) {
    const packages: Package[] = [...options.packages || []];
    const providers: Provider[] = [...BUILT_IN_PROVIDERS, ...options.providers || []];

    this.providers = [
      ...packages.map(it => it.providers || []).flat(),
      ...providers,
    ];
  }

  public async compile(): Promise<Application> {
    return await Application.create({
      providers: this.providers,
    });
  }

  protected overrideProvider(token: Token): OverrideBy<this> {
    return {
      useClass: (type: Type) => {
        return this.override(token, { provide: token, useClass: type });
      },
      useFactory: (options: OverrideByFactoryOptions) => {
        return this.override(token, { provide: token, useFactory: options.factory, inject: options.inject });
      },
      useValue: (value: any) => {
        return this.override(token, { provide: token, useValue: value });
      },
    };
  }

  protected override(token: Token, provider: Provider): this {
    const index: number = this.providers.findIndex(it => token === (isTypeProvider(it) ? it : it.provide));

    if (index !== -1) {
      this.providers.splice(index, 1, provider);
    }

    return this;
  }
}

export interface ApplicationBuilderOptions {
  packages?: Package[];
  providers?: Provider[];
}

export interface OverrideBy<T> {
  useClass: (type: Type) => T;
  useFactory: (options: OverrideByFactoryOptions) => T;
  useValue: (value: any) => T;
}

export interface OverrideByFactoryOptions {
  factory: (...args: any[]) => any;
  inject?: Token[];
}
