import * as http from 'http';

export interface Response extends http.ServerResponse {
  readonly headers: http.OutgoingHttpHeaders;

  getCookie(name: string, options?: GetCookieOptions): string | undefined;
  hasCookie(name: string, options?: HasCookieOptions): boolean;
  removeCookie(name: string): void;
  setCookie(name: string, value: string, options?: SetCookieOptions): void;
}

export interface GetCookieOptions {
  signed?: boolean;
}

export interface HasCookieOptions {
  signed?: boolean;
}

export interface SetCookieOptions {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  secureProxy?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none' | boolean;
  signed?: boolean;
  overwrite?: boolean;
}
