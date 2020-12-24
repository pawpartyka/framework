import { Provider } from './types/provider';
import { Type } from './types/type';
import { Logger } from './logger';
import { LoggerFactory } from './logger-factory';
import { Package } from './types/package';
import { Application } from './application';
import { Token } from './types/token';
import { getProviderToken } from './utils/get-provider-token';

export class ApplicationBuilder {
  protected readonly providers: Map<Token, Provider> = new Map();
  protected readonly signals: Set<string> = new Set();

  constructor(options: ApplicationBuilderOptions) {
    for (const pkg of options.packages || []) {
      for (const provider of pkg.providers || []) {
        this.providers.set(getProviderToken(provider), provider);
      }
    }

    for (const provider of options.providers || []) {
      this.providers.set(getProviderToken(provider), provider);
    }
  }

  public enableShutdownHooks(signals: string[]): ApplicationBuilder {
    for (const signal of signals) {
      this.signals.add(signal);
    }

    return this;
  }

  public useLogger(loggerRef: Type<Logger>): ApplicationBuilder {
    LoggerFactory.useLogger(loggerRef);

    return this;
  }

  public async compile(): Promise<Application> {
    return await Application.create({
      providers: [...this.providers.values()],
      signals: [...this.signals.values()],
    });
  }
}

export interface ApplicationBuilderOptions {
  packages?: Package[];
  providers?: Provider[];
}
