import { HttpMethod, HttpStatus } from '@artisanjs/common';
import { Response } from './response.interface';

export interface Adapter {
  (config: RequestOptions): Promise<Response>;
}

export interface BasicCredentials {
  password: string;
  username: string;
}

export interface Cancel {
  message: string;
}

export interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  throwIfRequested(): void;
}

export interface ProxyConfig {
  auth?: {
    username: string;
    password: string;
  };
  host: string;
  port: number;
  protocol?: string;
}

export interface RequestOptions {
  adapter?: Adapter;
  auth?: BasicCredentials;
  baseURL?: string;
  cancelToken?: CancelToken;
  data?: any;
  headers?: any;
  httpAgent?: any;
  httpsAgent?: any;
  maxContentLength?: number;
  maxRedirects?: number;
  method?: HttpMethod;
  onDownloadProgress?: (progressEvent: any) => void;
  onUploadProgress?: (progressEvent: any) => void;
  params?: any;
  paramsSerializer?: (params: any) => string;
  proxy?: ProxyConfig | false;
  responseType?: ResponseType;
  socketPath?: string | null;
  timeout?: number;
  timeoutErrorMessage?: string;
  transformRequest?: Transformer | Transformer[];
  transformResponse?: Transformer | Transformer[];
  url?: string;
  validateStatus?: (status: HttpStatus) => boolean;
  withCredentials?: boolean;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
}

export interface Transformer {
  (data: any, headers?: any): any;
}

export type ResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream';
