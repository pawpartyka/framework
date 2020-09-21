import { Inject } from '@artisanjs/core';
import { getVaultToken } from '../providers/vault.provider';

export function InjectVault(name: string): ParameterDecorator {
  return Inject(getVaultToken(name));
}
