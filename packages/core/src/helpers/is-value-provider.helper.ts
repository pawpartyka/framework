import { ValueProvider } from '../interfaces/value-provider.interface';

export function isValueProvider(provider: any): provider is ValueProvider {
  return typeof provider === 'object' && !!(provider as ValueProvider)?.useValue;
}
