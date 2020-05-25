import { ForwardRef } from '../interfaces/forward-ref.interface';

export function isForwardRef(token: any): token is ForwardRef {
  return typeof token === 'object' && !!(token as ForwardRef)?.forwardRef;
}
