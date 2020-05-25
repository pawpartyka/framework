import { RequestParam } from '../decorators/request-param.decorator';
import { Request } from '../interfaces/request.interface';
import { Response } from '../interfaces/response.interface';

export function createParamDecorator(factory: CustomParamFactory): (data?: any) => ParameterDecorator {
  return (data?: any) => RequestParam((request: Request, response: Response) => {
    return factory(data, request, response);
  });
}

export interface CustomParamFactory {
  (data: any, request: Request, response: Response): any;
}
