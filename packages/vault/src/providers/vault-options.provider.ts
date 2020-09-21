import { ClassProvider, ExistingProvider, FactoryProvider, Provider, Token } from '@artisanjs/core';
import { VaultOptions } from '../interfaces/vault-options.interface';

export function createVaultOptionsProvider(vaultName: string, provider: VaultOptionsProvider): Provider {
  return {
    provide: getVaultOptionsToken(vaultName),
    useClass: provider['useClass'],
    useExisting: provider['useExisting'],
    useFactory: provider['useFactory'],
    useValue: provider['useValue'],
    inject: provider['inject'],
  };
}

export function getVaultOptionsToken(name: string): Token {
  return `VaultOptions_${ name }`;
}

export interface VaultOptionsFactory {
  createVaultOptions(): Promise<VaultOptions> | VaultOptions;
}

export type VaultOptionsProvider =
  | Omit<ClassProvider<VaultOptionsFactory>, 'provide' | 'multi'>
  | Omit<ExistingProvider<VaultOptionsFactory>, 'provide' | 'multi'>
  | Omit<FactoryProvider<VaultOptions>, 'provide' | 'multi'>;
