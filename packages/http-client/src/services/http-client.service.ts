import { HttpMethod } from '@artisanjs/common';
import { Inject, Injectable } from '@artisanjs/core';
import { makeRequest } from '../helpers/make-request.helper';
import { RequestOptions } from '../interfaces/request-options.interface';
import { Response } from '../interfaces/response.interface';
import { DefaultRequestOptions, DEFAULT_REQUEST_OPTIONS } from '../providers/default-request-options.provider';

@Injectable()
export class HttpClient {
  constructor(
    @Inject(DEFAULT_REQUEST_OPTIONS) private readonly defaultRequestOptions: DefaultRequestOptions,
  ) {
  }

  public async delete(
    url: string,
    options?: { responseType: 'buffer' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<Buffer>>;

  public async delete<R = any>(
    url: string,
    options?: { responseType: 'json' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<R>>;

  public async delete(
    url: string,
    options?: { responseType: 'stream' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<NodeJS.ReadableStream>>;

  public async delete(
    url: string,
    options?: { responseType: 'text' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<string>>;

  public async delete(
    url: string,
    options?: Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<any>> {
    return await this.request({ ...options, method: HttpMethod.DELETE, url } as any);
  }

  public async get(
    url: string,
    options?: { responseType: 'buffer' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<Buffer>>;

  public async get<R = any>(
    url: string,
    options?: { responseType: 'json' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<R>>;

  public async get(
    url: string,
    options?: { responseType: 'stream' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<NodeJS.ReadableStream>>;

  public async get(
    url: string,
    options?: { responseType: 'text' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<string>>;

  public async get(
    url: string,
    options?: Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<any>> {
    return await this.request({ ...options, method: HttpMethod.GET, url } as any);
  }

  public async head(
    url: string,
    options?: { responseType: 'buffer' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<Buffer>>;

  public async head<R = any>(
    url: string,
    options?: { responseType: 'json' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<R>>;

  public async head(
    url: string,
    options?: { responseType: 'stream' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<NodeJS.ReadableStream>>;

  public async head(
    url: string,
    options?: { responseType: 'text' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<string>>;

  public async head(
    url: string,
    options?: Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<any>> {
    return await this.request({ ...options, method: HttpMethod.HEAD, url } as any);
  }

  public async options(
    url: string,
    options?: { responseType: 'buffer' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<Buffer>>;

  public async options<R = any>(
    url: string,
    options?: { responseType: 'json' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<R>>;

  public async options(
    url: string,
    options?: { responseType: 'stream' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<NodeJS.ReadableStream>>;

  public async options(
    url: string,
    options?: { responseType: 'text' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<string>>;

  public async options(
    url: string,
    options?: Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<any>> {
    return await this.request({ ...options, method: HttpMethod.OPTIONS, url } as any);
  }

  public async patch(
    url: string,
    body?: any,
    options?: { responseType: 'buffer' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<Buffer>>;

  public async patch<R = any>(
    url: string,
    body?: any,
    options?: { responseType: 'json' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<R>>;

  public async patch(
    url: string,
    body?: any,
    options?: { responseType: 'stream' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<NodeJS.ReadableStream>>;

  public async patch(
    url: string,
    body?: any,
    options?: { responseType: 'text' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<string>>;

  public async patch(
    url: string,
    body?: any,
    options?: Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<any>> {
    return await this.request({ ...options, body, method: HttpMethod.PATCH, url } as any);
  }

  public async post(
    url: string,
    body?: any,
    options?: { responseType: 'buffer' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<Buffer>>;

  public async post<R = any>(
    url: string,
    body?: any,
    options?: { responseType: 'json' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<R>>;

  public async post(
    url: string,
    body?: any,
    options?: { responseType: 'stream' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<NodeJS.ReadableStream>>;

  public async post(
    url: string,
    body?: any,
    options?: { responseType: 'text' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<string>>;

  public async post(
    url: string,
    body?: any,
    options?: Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<any>> {
    return await this.request({ ...options, body, method: HttpMethod.POST, url } as any);
  }

  public async put(
    url: string,
    body?: any,
    options?: { responseType: 'buffer' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<Buffer>>;

  public async put<R = any>(
    url: string,
    body?: any,
    options?: { responseType: 'json' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<R>>;

  public async put(
    url: string,
    body?: any,
    options?: { responseType: 'stream' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<NodeJS.ReadableStream>>;

  public async put(
    url: string,
    body?: any,
    options?: { responseType: 'text' } & Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<string>>;

  public async put(
    url: string,
    body?: any,
    options?: Omit<RequestOptions, 'body' | 'method' | 'url'>,
  ): Promise<Response<any>> {
    return await this.request({ ...options, body, method: HttpMethod.PUT, url } as any);
  }

  public async request(
    options: { responseType: 'buffer' } & RequestOptions,
  ): Promise<Response<Buffer>>;

  public async request<R = any>(
    options: { responseType: 'json' } & RequestOptions,
  ): Promise<Response<R>>;

  public async request(
    options: { responseType: 'stream' } & RequestOptions,
  ): Promise<Response<NodeJS.ReadableStream>>;

  public async request(
    options: { responseType: 'text' } & RequestOptions,
  ): Promise<Response<string>>;

  public async request(
    options: RequestOptions,
  ): Promise<Response<any>> {
    return await makeRequest({ ...this.defaultRequestOptions, ...options });
  }
}
