import { Provider } from '@artisanjs/core';
import { EnvironmentPackage } from '../src/lib/environment-package';
import { Environment } from '../src/lib/services/environment';

describe('EnvironmentPackage', () => {
  const providers: Provider[] = EnvironmentPackage
    .configure()
    .register()
    .providers;

  it('should include the Environment', async () => {
    expect(providers).toContain(Environment);
  });
});
