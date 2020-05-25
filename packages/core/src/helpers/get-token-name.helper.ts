import { Token } from '../interfaces/token.interface';
import { isTypeProvider } from './is-type-provider.helper';

export function getTokenName(token: Token): string {
  return isTypeProvider(token) ? token.name : token.toString();
}
