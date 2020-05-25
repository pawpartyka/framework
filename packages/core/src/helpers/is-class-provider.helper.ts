import { ClassProvider } from '../interfaces/class-provider.interface';

export function isClassProvider(provider: any): provider is ClassProvider {
  return typeof provider === 'object' && !!(provider as ClassProvider)?.useClass;
}
