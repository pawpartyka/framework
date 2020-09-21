// tslint:disable
import 'reflect-metadata';
import { ArtisanFactory } from '@artisanjs/core';
import { getVaultToken } from './providers/vault.provider';
import { VaultPackage } from './vault.package';
import { HttpClientPackage } from '@artisanjs/http-client';

// export * from './decorators/inject-vault.decorator';
// export * from './interfaces/vault.interface';
// export * from './interfaces/vault-options.interface';
// export * from './providers/vault.provider';
// export * from './providers/vault-options.provider';
// export * from './vault.package';

(async (): Promise<void> => {
  const app = await ArtisanFactory
    .configureApplication({
      packages: [
        HttpClientPackage
          .configure()
          .register(),
        VaultPackage
          .configure()
          .declareVault('default', {
            token: 'myroot',
            url: 'http://0.0.0.0:8200/v1',
          })
          .register(),
      ],
    })
    .compile();

  const defaultVault = await app.find(getVaultToken('default'));

  console.log(await defaultVault.help('cubbyhole/co'));
})();
