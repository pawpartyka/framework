import { isClassProvider, isExistingProvider, isFactoryProvider, Package, Provider } from '@artisanjs/core';
import { TransporterOptions } from './interfaces/transporter-options.interface';
import { createTransporterOptionsProvider, TransporterOptionsProvider } from './providers/transporter-options.provider';
import { createTransporterProvider } from './providers/transporter.provider';

export class MailPackage {
  public static configure(): MailPackage {
    return new MailPackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [];
  }

  public declareTransporter(name: string, options: TransporterOptions | TransporterOptionsProvider): MailPackage {
    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createTransporterOptionsProvider(name, options));
    } else {
      this.providers.push(createTransporterOptionsProvider(name, { useFactory: () => options as TransporterOptions }));
    }

    this.providers.push(createTransporterProvider(name));

    return this;
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
