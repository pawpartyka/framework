import { TypeProvider } from '../interfaces/type-provider.interface';

export function isTypeProvider(provider: any): provider is TypeProvider {
  return typeof provider === 'function';
}
