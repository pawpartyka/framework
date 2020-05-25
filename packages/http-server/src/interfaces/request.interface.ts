import { HttpMethod } from '@artisanjs/common';
import * as http from 'http';

export interface Request extends http.IncomingMessage {
  body: any;
  cookies: { [key: string]: string };
  method: HttpMethod;
  params: { [key: string]: string };
  query: { [key: string]: string | string[] };

  accepts(types?: string | string[]): string | string[] | boolean;
  acceptsCharsets(charsets?: string | string[]): string | string[] | boolean;
  acceptsEncodings(encodings?: string | string[]): string | string[] | boolean;
  acceptsLanguages(languages?: string | string[]): string | string[] | boolean;
  getHeader(name: string): string | string[] | undefined;
  hasHeader(name: string): boolean;
  isContentType(types: string | string[]): string | string[] | boolean;
}
