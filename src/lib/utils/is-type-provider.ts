import { TypeProvider } from '../types/provider';

export function isTypeProvider(provider: any): provider is TypeProvider {
  return typeof provider === 'function';
}
