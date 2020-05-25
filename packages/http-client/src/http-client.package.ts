import { Package, Provider } from '@artisanjs/core';
import { HttpClient } from './services/http-client.service';

export class HttpClientPackage {
  public static configure(): HttpClientPackage {
    return new HttpClientPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [
      HttpClient,
    ];
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
