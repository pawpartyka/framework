import { Injectable, Test, TestingLogger } from '@artisanjs/core';
import { Scheduled } from '../src/lib/decorators/scheduled';
import { SchedulePackage } from '../src/lib/schedule-package';
import { Job, JobOptions } from '../src/lib/adapters/job';

jest.mock('../src/lib/adapters/job');

@Injectable()
class Foo {
  @Scheduled('* * * * 10')
  @Scheduled('* * * * 5', {
    timeZone: 'America/Los_Angeles',
    unrefTimeout: true,
    utcOffset: 1,
  })
  hello(): void {
  }

  @Scheduled('* * * * *')
  world(): void {
  }
}

describe('Schedule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize jobs on application init', async () => {
    const loggerSpy = jest.spyOn(TestingLogger.prototype, 'info');

    await Test
      .configureTestingApplication({
        packages: [SchedulePackage.configure().register()],
        providers: [Foo],
      })
      .compile();

    expect(Job).toHaveBeenCalledTimes(3);
    expect(Job).toHaveBeenCalledWith(<JobOptions> {
      callback: expect.any(Function),
      expression: '* * * * 10',
      name: expect.any(String),
      timeZone: undefined,
      unrefTimeout: undefined,
      utcOffset: undefined,
    });
    expect(Job).toHaveBeenCalledWith(<JobOptions> {
      callback: expect.any(Function),
      expression: '* * * * 5',
      name: expect.any(String),
      timeZone: 'America/Los_Angeles',
      unrefTimeout: true,
      utcOffset: 1,
    });
    expect(Job).toHaveBeenCalledWith(<JobOptions> {
      callback: expect.any(Function),
      expression: '* * * * *',
      name: expect.any(String),
      timeZone: undefined,
      unrefTimeout: undefined,
      utcOffset: undefined,
    });

    expect(loggerSpy).toHaveBeenCalledWith('Mapped {* * * * 10} schedule job');
    expect(loggerSpy).toHaveBeenCalledWith('Mapped {* * * * *} schedule job');
    expect(loggerSpy).toHaveBeenCalledWith('Mapped {* * * * 5} schedule job');
  });

  it('should call the start method on each job on application listen', async () => {
    const startSpy = jest.spyOn(Job.prototype, 'start').mockImplementation(jest.fn());

    const application = await Test
      .configureTestingApplication({
        packages: [SchedulePackage.configure().register()],
        providers: [Foo],
      })
      .compile();

    expect(startSpy).not.toHaveBeenCalled();

    await application.listen();

    expect(startSpy).toHaveBeenCalledTimes(3);
  });

  it('should call the stop method on each job on application shutdown', async () => {
    const stopSpy = jest.spyOn(Job.prototype, 'stop').mockImplementation(jest.fn());

    const application = await Test
      .configureTestingApplication({
        packages: [SchedulePackage.configure().register()],
        providers: [Foo],
      })
      .compile();

    expect(stopSpy).not.toHaveBeenCalled();

    await application.shutdown();

    expect(stopSpy).toHaveBeenCalledTimes(3);
  });
});
