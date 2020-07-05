import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';
import { StorageOptions } from '../interfaces/storage-options.interface';

export function createStorageOptionsProvider(storageName: string, provider: StorageOptionsProvider): Provider {
  return {
    provide: getStorageOptionsToken(storageName),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
  };
}

export function getStorageOptionsToken(name: string): Token {
  return `StorageOptions_${ name }`;
}

export interface StorageOptionsFactory {
  createStorageOptions(): Promise<StorageOptions> | StorageOptions;
}

export type StorageOptionsProvider =
  | Omit<ClassProvider<StorageOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<StorageOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<StorageOptions>, 'provide' | 'multi'>;
