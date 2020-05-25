import { HttpMethod } from '@artisanjs/common';
import * as accepts from 'accepts';
import * as http from 'http';
import * as typeis from 'type-is';
import { parseBody } from '../helpers/parse-body.helper';
import { parseCookies } from '../helpers/parse-cookies.helper';
import { parseQuery } from '../helpers/parse-query.helper';
import { Request } from '../interfaces/request.interface';

export async function createRequestAdapter(req: http.IncomingMessage, params: { [k: string]: string | undefined }): Promise<Request> {
  const accept = accepts(req);

  return Object.assign(req, {
    body: await parseBody(req),
    cookies: await parseCookies(req),
    method: req.method as HttpMethod,
    params: params,
    query: await parseQuery(req),

    accepts(types?: string | string[]): string | string[] | boolean {
      return accept.types(types ? (typeof types === 'string' ? [types] : types) : undefined);
    },
    acceptsCharsets(charsets?: string | string[]): string | string[] | boolean {
      return accept.charsets(charsets ? (typeof charsets === 'string' ? [charsets] : charsets) : undefined);
    },
    acceptsEncodings(encodings?: string | string[]): string | string[] | boolean {
      return accept.encodings(encodings ? (typeof encodings === 'string' ? [encodings] : encodings) : undefined);
    },
    acceptsLanguages(languages?: string | string[]): string | string[] | boolean {
      return accept.languages(languages ? (typeof languages === 'string' ? [languages] : languages) : undefined);
    },
    getHeader(name: string): string | string[] | undefined {
      return req.headers[name.toLowerCase()];
    },
    hasHeader(name: string): boolean {
      return !!this.getHeader(name);
    },
    isContentType(types: string | string[]): string | string[] | boolean {
      return typeis(req, typeof types === 'string' ? [types] : types);
    },
  });
}
