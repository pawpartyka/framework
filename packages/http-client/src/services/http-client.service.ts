import { Injectable } from '@artisanjs/core';
import * as Axios from 'axios';
import { createResponseAdapter } from '../adapters/response.adapter';
import { RequestOptions } from '../interfaces/request-options.interface';
import { Response } from '../interfaces/response.interface';

@Injectable()
export class HttpClient {
  public async delete<R = any>(url: string, options?: Pick<RequestOptions, 'method' | 'url'>): Promise<Response<R>> {
    return createResponseAdapter(await Axios.default({ ...options, method: 'delete', url } as any));
  }

  public async get<R = any>(url: string, options?: Pick<RequestOptions, 'method' | 'url'>): Promise<Response<R>> {
    return createResponseAdapter(await Axios.default({ ...options, method: 'get', url } as any));
  }

  public async head<R = any>(url: string, options?: Pick<RequestOptions, 'method' | 'url'>): Promise<Response<R>> {
    return createResponseAdapter(await Axios.default({ ...options, method: 'head', url } as any));
  }

  public async options<R = any>(url: string, options?: Pick<RequestOptions, 'method' | 'url'>): Promise<Response<R>> {
    return createResponseAdapter(await Axios.default({ ...options, method: 'options', url } as any));
  }

  public async patch<R = any>(url: string, data?: any, options?: Pick<RequestOptions, 'data' | 'method' | 'url'>): Promise<Response<R>> {
    return createResponseAdapter(await Axios.default({ ...options, data, method: 'patch', url } as any));
  }

  public async post<R = any>(url: string, data?: any, options?: Pick<RequestOptions, 'data' | 'method' | 'url'>): Promise<Response<R>> {
    return createResponseAdapter(await Axios.default({ ...options, data, method: 'post', url } as any));
  }

  public async put<R = any>(url: string, data?: any, options?: Pick<RequestOptions, 'data' | 'method' | 'url'>): Promise<Response<R>> {
    return createResponseAdapter(await Axios.default({ ...options, data, method: 'put', url } as any));
  }

  public async request<R = any>(options: RequestOptions): Promise<Response<R>> {
    return createResponseAdapter(await Axios.default(options as any));
  }
}
