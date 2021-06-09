import { Injector } from './injector';
import { isTypeProvider } from './utils/is-type-provider';
import { isClassProvider } from './utils/is-class-provider';
import { OnApplicationInit } from './types/hooks';
import { Application } from './application';
import { Provider } from './types/provider';
import { Package } from './types/package';
import { Token } from './types/token';
import { getProviderToken } from './utils/get-provider-token';

export async function bootstrap(options: { packages?: Package[]; providers?: Provider[]; }): Promise<Application> {
  const providers: Map<Token, Provider> = new Map();

  for (const pkg of options.packages || []) {
    for (const provider of pkg.providers || []) {
      providers.set(getProviderToken(provider), provider);
    }
  }

  for (const provider of options.providers || []) {
    providers.set(getProviderToken(provider), provider);
  }

  const injector: Injector = await Injector.create([...this.providers.values()]);

  for (const provider of await injector.filter(token => isTypeProvider(token) || isClassProvider(token))) {
    if (typeof (provider as OnApplicationInit).onApplicationInit === 'function') {
      await provider.onApplicationInit();
    }
  }

  return new Application(injector);
}
