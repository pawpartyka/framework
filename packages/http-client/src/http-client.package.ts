import { Package, Provider } from '@artisanjs/core';
import { createDefaultRequestOptionsProvider } from './providers/default-request-options.provider';
import { HttpClient } from './services/http-client.service';

const BUILT_IN_PROVIDERS: Provider[] = [
  createDefaultRequestOptionsProvider(),
];

const BUILT_IN_SERVICES: Provider[] = [
  HttpClient,
];

export class HttpClientPackage {
  public static configure(): HttpClientPackage {
    return new HttpClientPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      ...BUILT_IN_PROVIDERS,
      ...BUILT_IN_SERVICES,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
