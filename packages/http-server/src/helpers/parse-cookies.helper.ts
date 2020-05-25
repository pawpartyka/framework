import * as cookie from 'cookie';
import * as http from 'http';

export async function parseCookies(req: http.IncomingMessage): Promise<{ [key: string]: string }> {
  return cookie.parse(req.headers.cookie || '');
}
