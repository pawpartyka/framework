import { ExistingProvider } from '../interfaces/existing-provider.interface';

export function isExistingProvider(provider: any): provider is ExistingProvider {
  return typeof provider === 'object' && !!(provider as ExistingProvider)?.useExisting;
}
