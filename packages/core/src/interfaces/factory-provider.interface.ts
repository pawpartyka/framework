import { Token } from './token.interface';

export interface FactoryProvider<T = any> {
  provide: Token;
  useFactory: (...args: any[]) => T;
  inject?: Token[];
  multi?: boolean;
}
