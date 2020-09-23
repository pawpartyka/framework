import { RequestOptions } from '@artisanjs/http-client';

export interface Vault {
  token: string;
  url: string;

  delete(path: string): Promise<any>;
  help(path: string): Promise<any>;
  list(path: string): Promise<any>;
  read(path: string): Promise<any>;
  request(options: Omit<RequestOptions, 'responseType'>): Promise<any>;
  write(path: string, data: any): Promise<any>;
}
