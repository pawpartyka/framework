import { getTokenName } from './get-token-name';
import { getProviderToken } from './get-provider-token';
import { Provider } from '../types/provider';

export function getProviderName(provider: Provider): string {
  return getTokenName(getProviderToken(provider));
}
