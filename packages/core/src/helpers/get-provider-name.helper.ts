import { Provider } from '../interfaces/provider.interface';
import { isTypeProvider } from './is-type-provider.helper';

export function getProviderName(provider: Provider): string {
  return isTypeProvider(provider) ? provider.name : this.getTokenName(provider.provide);
}
