import centra from 'centra';
import { RequestOptions } from '../interfaces/request-options.interface';
import { Response } from '../interfaces/response.interface';

export async function makeRequest(options: RequestOptions): Promise<Response<any>> {
  const builder = centra(options.url, options.method);

  if (options.body) {
    builder.body(options.body);
  }

  if (options.compression) {
    builder.compress();
  }

  if (options.headers) {
    builder.header(options.headers);
  }

  if (options.params) {
    builder.query(options.params);
  }

  if (options.responseType === 'stream') {
    builder.stream();
  }

  if (options.timeout) {
    builder.timeout(options.timeout);
  }

  let body: any;

  const result = await builder.send();

  switch (options.responseType) {
    case 'buffer':
      body = result.body;
      break;
    case 'json':
      body = await result.json();
      break;
    case 'stream':
      body = result;
      break;
    case 'text':
      body = await result.text();
      break;
  }

  return {
    body: body,
    headers: result.headers as any,
    status: result.coreRes?.statusCode,
    statusText: result.coreRes?.statusMessage,
  };
}
