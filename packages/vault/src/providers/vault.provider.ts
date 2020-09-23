import { HttpMethod } from '@artisanjs/common';
import { Provider, Token } from '@artisanjs/core';
import { HttpClient } from '@artisanjs/http-client';
import { RequestOptions } from '@artisanjs/http-client';
import { VaultOptions } from '../interfaces/vault-options.interface';
import { Vault } from '../interfaces/vault.interface';
import { getVaultOptionsToken } from './vault-options.provider';

export function createVaultProvider(vaultName: string): Provider {
  return {
    provide: getVaultToken(vaultName),
    useFactory: async (httpClient: HttpClient, vaultOptions: VaultOptions): Promise<Vault> => {
      const headers = {};

      if (vaultOptions.namespace) {
        headers['X-Vault-Namespace'] = vaultOptions.namespace;
      }

      if (vaultOptions.token) {
        headers['X-Vault-Token'] = vaultOptions.token;
      }

      return {
        token: vaultOptions.token,
        url: vaultOptions.url,

        delete: async (path: string): Promise<any> => {
          return await httpClient.request({
            headers: headers,
            method: HttpMethod.DELETE,
            responseType: 'json',
            url: 'http://0.0.0.0:8200/v1/' + path,
          });
        },
        help: async (path: string): Promise<any> => {
          return await httpClient.request({
            headers: headers,
            method: HttpMethod.GET,
            params: {
              help: '1',
            },
            responseType: 'json',
            url: 'http://0.0.0.0:8200/v1/' + path,
          });
        },
        list: async (path: string): Promise<any> => {
          return await httpClient.request({
            headers: headers,
            method: HttpMethod.GET,
            params: {
              list: '1',
            },
            responseType: 'json',
            url: 'http://0.0.0.0:8200/v1/' + path,
          });
        },
        read: async (path: string): Promise<any> => {
          return await httpClient.request({
            headers: headers,
            method: HttpMethod.GET,
            responseType: 'json',
            url: 'http://0.0.0.0:8200/v1/' + path,
          });
        },
        request: async (options: Omit<RequestOptions, 'responseType'>): Promise<any> => {
          return await httpClient.request({
            ...options,
            headers: {
              ...headers,
              ...options.headers || {},
            },
            responseType: 'json',
            url: 'http://0.0.0.0:8200/v1/' + options.url,
          });
        },
        write: async (path: string, data: any): Promise<any> => {
          return await httpClient.request({
            body: data,
            headers: headers,
            method: HttpMethod.PUT,
            responseType: 'json',
            url: 'http://0.0.0.0:8200/v1/' + path,
          });
        },
      };
    },
    inject: [HttpClient, getVaultOptionsToken(vaultName)],
  };
}

export function getVaultToken(name: string): Token {
  return `Vault_${ name }`;
}
