import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';
import { TransporterOptions } from '../interfaces/transporter-options.interface';

export function createTransporterOptionsProvider(storageName: string, provider: TransporterOptionsProvider): Provider {
  return {
    provide: getTransporterOptionsToken(storageName),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
  };
}

export function getTransporterOptionsToken(name: string): Token {
  return `TransporterOptions_${ name }`;
}

export interface TransporterOptionsFactory {
  createTransporterOptions(): Promise<TransporterOptions> | TransporterOptions;
}

export type TransporterOptionsProvider =
  | Omit<ClassProvider<TransporterOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<TransporterOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<TransporterOptions>, 'provide' | 'multi'>;
