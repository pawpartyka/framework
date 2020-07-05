import { isClassProvider, isExistingProvider, isFactoryProvider, Package, Provider } from '@artisanjs/core';
import { StorageOptions } from './interfaces/storage-options.interface';
import { createStorageOptionsProvider, StorageOptionsProvider } from './providers/storage-options.provider';
import { createStorageProvider } from './providers/storage.provider';

export class StoragePackage {
  public static configure(): StoragePackage {
    return new StoragePackage();
  }

  private readonly providers: Provider[];

  protected constructor() {
    this.providers = [];
  }

  public declareStorage(name: string, options: StorageOptions | StorageOptionsProvider): StoragePackage {
    if (isClassProvider(options) || isExistingProvider(options) || isFactoryProvider(options)) {
      this.providers.push(createStorageOptionsProvider(name, options));
    } else {
      this.providers.push(createStorageOptionsProvider(name, { useFactory: () => options as StorageOptions }));
    }

    this.providers.push(createStorageProvider(name));

    return this;
  }

  public register(): Package {
    return {
      providers: this.providers,
    };
  }
}
