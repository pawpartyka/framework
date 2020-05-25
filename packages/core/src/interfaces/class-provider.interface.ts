import { Token } from './token.interface';
import { Type } from './type.interface';

export interface ClassProvider<T = any> {
  provide: Token;
  useClass: Type<T>;
  multi?: boolean;
}
