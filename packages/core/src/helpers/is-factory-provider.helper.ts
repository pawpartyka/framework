import { FactoryProvider } from '../interfaces/factory-provider.interface';

export function isFactoryProvider(provider: any): provider is FactoryProvider {
  return typeof provider === 'object' && !!(provider as FactoryProvider)?.useFactory;
}
