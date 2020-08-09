import { Provider } from '../interfaces/provider.interface';
import { getTokenName } from './get-token-name.helper';
import { isTypeProvider } from './is-type-provider.helper';

export function getProviderName(provider: Provider): string {
  return isTypeProvider(provider) ? provider.name : getTokenName(provider.provide);
}
