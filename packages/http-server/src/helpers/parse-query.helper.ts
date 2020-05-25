import * as http from 'http';
import * as qs from 'qs';
import * as url from 'url';

export async function parseQuery(req: http.IncomingMessage): Promise<{ [key: string]: string | string[] }> {
  return qs.parse(url.parse(req.url).query) as { [key: string]: string | string[] };
}
