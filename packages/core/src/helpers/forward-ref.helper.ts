import { ForwardRef } from '../interfaces/forward-ref.interface';
import { Token } from '../interfaces/token.interface';

export function forwardRef(fn: () => Token): ForwardRef {
  return { forwardRef: fn };
}
