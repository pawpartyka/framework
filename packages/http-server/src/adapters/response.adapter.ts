import * as cookies from 'cookies';
import * as http from 'http';
import { GetCookieOptions, HasCookieOptions, Response, SetCookieOptions } from '../interfaces/response.interface';

export async function createResponseAdapter(req: http.IncomingMessage, res: http.ServerResponse): Promise<Response> {
  const cookie = cookies(req, res);

  return Object.assign(res, {
    get headers(): http.OutgoingHttpHeaders {
      return res.getHeaders();
    },

    getCookie(name: string, options?: GetCookieOptions): string | undefined {
      return cookie.get(name, { signed: options?.signed });
    },
    hasCookie(name: string, options?: HasCookieOptions): boolean {
      return cookie.get(name, { signed: options?.signed }) !== undefined;
    },
    removeCookie(name: string): void {
      cookie.set(name);
    },
    setCookie(name: string, value: string, options?: SetCookieOptions): void {
      cookie.set(name, value, options);
    },
  });
}
