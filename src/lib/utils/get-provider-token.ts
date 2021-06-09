import { Token } from '../types/token';
import { isTypeProvider } from './is-type-provider';
import { Provider } from '../types/provider';

export function getProviderToken(provider: Provider): Token {
  return isTypeProvider(provider) ? provider : provider.provide;
}
