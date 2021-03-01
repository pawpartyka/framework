import { Provider } from '@artisanjs/core';
import { Schedule } from '../src/lib/services/schedule';
import { SchedulePackage } from '../src/lib/schedule-package';
import { ScheduleManager } from '../src/lib/schedule-manager';

describe('SchedulePackage', () => {
  const providers: Provider[] = SchedulePackage
    .configure()
    .register()
    .providers;

  it('should include the Schedule', async () => {
    expect(providers).toContain(Schedule);
  });

  it('should include the ScheduleManager', async () => {
    expect(providers).toContain(ScheduleManager);
  });
});
