import { Token } from './token.interface';

export interface ValueProvider<T = any> {
  provide: Token;
  useValue: T;
  multi?: boolean;
}
