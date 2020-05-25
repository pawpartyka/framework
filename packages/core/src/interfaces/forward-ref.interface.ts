import { Token } from './token.interface';

export interface ForwardRef<T = any> {
  forwardRef: () => Token<T>;
}
