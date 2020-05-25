import { Next } from './next.interface';
import { Request } from './request.interface';
import { Response } from './response.interface';

export interface Interceptor {
  intercept(request: Request, response: Response, next: Next): void | Promise<void>;
}
