import { Token } from './token.interface';

export interface ExistingProvider<T = any> {
  provide: Token;
  useExisting: Token<T>;
  multi?: boolean;
}
