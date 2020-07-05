import { Provider, Token } from '@artisanjs/core';
import { copyFile, existsSync, mkdir, readdir, readFile, rename, rmdir, stat, unlink, writeFile, Dirent, Stats } from 'fs';
import { join } from 'path';
import { StorageOptions } from '../interfaces/storage-options.interface';
import { LsOptions, MkdirOptions, ReadOptions, RmdirOptions, StatResult, Storage, WriteOptions } from '../interfaces/storage.interface';
import { getStorageOptionsToken } from './storage-options.provider';

export function createStorageProvider(storageName: string): Provider {
  return {
    provide: getStorageToken(storageName),
    useFactory: (storageOptions: StorageOptions): Storage => {
      const { root = process.cwd() } = storageOptions;

      return {
        cp: (source: string, dest: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            copyFile(join(root, source), join(root, dest), (error: any) => {
              if (error) {
                return reject(error);
              }

              return resolve();
            });
          });
        },
        exists: (path: string): Promise<boolean> => {
          return new Promise((resolve) => {
            return resolve(existsSync(join(root, path)));
          });
        },
        ls: (path: string, options: LsOptions): Promise<string[]> => {
          return new Promise((resolve, reject) => {
            readdir(join(root, path), { encoding: options?.encoding, withFileTypes: true }, (error: any, items: Dirent[]) => {
              if (error) {
                return reject(error);
              }

              return resolve(items.map(it => it.name));
            });
          });
        },
        mkdir: (path: string, options?: MkdirOptions): Promise<void> => {
          return new Promise((resolve, reject) => {
            if (existsSync(join(root, path))) {
              return resolve();
            }

            mkdir(join(root, path), options, (error: any) => {
              if (error) {
                return reject(error);
              }

              return resolve();
            });
          });
        },
        mv: (source: string, dest: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            rename(join(root, source), join(root, dest), (error: any) => {
              if (error) {
                return reject(error);
              }

              return resolve();
            });
          });
        },
        read: (path: string, options?: ReadOptions): Promise<Buffer> => {
          return new Promise((resolve, reject) => {
            readFile(join(root, path), options, (error: any, data: Buffer) => {
              if (error) {
                return reject(error);
              }

              return resolve(data);
            });
          });
        },
        rmdir: (path: string, options?: RmdirOptions): Promise<void> => {
          return new Promise((resolve, reject) => {
            rmdir(join(root, path), options, (error: any) => {
              if (error) {
                return reject(error);
              }

              return resolve();
            });
          });
        },
        stat: (path: string): Promise<StatResult> => {
          return new Promise((resolve, reject) => {
            stat(join(root, path), (error: any, stats: Stats) => {
              if (error) {
                return reject(error);
              }

              return resolve({
                size: stats.size,
                mtime: stats.mtime,
              });
            });
          });
        },
        unlink: (path: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            unlink(join(root, path), (error: any) => {
              if (error) {
                return reject(error);
              }

              return resolve();
            });
          });
        },
        write: (path: string, data: Buffer, options?: WriteOptions): Promise<void> => {
          return new Promise((resolve, reject) => {
            writeFile(join(root, path), data, options, (error: any) => {
              if (error) {
                return reject(error);
              }

              return resolve();
            });
          });
        },
      };
    },
    inject: [getStorageOptionsToken(storageName)],
  };
}

export function getStorageToken(name: string): Token {
  return `Storage_${ name }`;
}
