import { Application } from './application';
import { Dependency, isTypeProvider, Provider, Token, Type } from './utils';

export class ApplicationBuilder {
  private readonly providers: Provider[];

  constructor(options: ApplicationBuilderOptions) {
    this.providers = [
      ...(options.packages || []).map(it => it.providers || []).flat(),
      ...options.providers || [],
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
        return this.override(token, { provide: token, useFactory: options.factory, dependencies: options.dependencies });
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
  dependencies?: (Token | Dependency)[];
}

export interface Package {
  providers?: Provider[];
}
