import { Provider } from '../interfaces/provider.interface';
import { Token } from '../interfaces/token.interface';
import { isTypeProvider } from './is-type-provider.helper';

export function getProviderToken(provider: Provider): Token {
  return isTypeProvider(provider) ? provider : provider.provide;
}
