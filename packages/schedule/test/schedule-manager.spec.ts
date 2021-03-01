import { Injectable, Injector, Logger } from '@artisanjs/core';
import { Scheduled } from '../src/lib/decorators/scheduled';
import { Job } from '../src/lib/adapters/job';
import { Schedule } from '../src/lib/services/schedule';
import { ScheduleManager } from '../src/lib/schedule-manager';
import { JobOptions } from '../src/lib/adapters/job';

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

@Injectable()
class Bar {
  @Scheduled('* * * * *', {
    name: 'hello',
  })
  hello(): void {
  }
}

describe('ScheduleManager', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add jobs to schedule on application init', async () => {
    const schedulePushSpy = jest.spyOn(Schedule.prototype, 'push');
    const loggerInfoSpy = jest.spyOn(Logger.prototype, 'info');

    await new ScheduleManager(await Injector.create([Foo, Bar]), new Schedule()).onApplicationInit();

    expect(Job).toHaveBeenCalledTimes(4);
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
      name: 'hello',
      timeZone: undefined,
      unrefTimeout: undefined,
      utcOffset: undefined,
    });

    expect(schedulePushSpy).toHaveBeenNthCalledWith(4, expect.any(Job));

    expect(loggerInfoSpy).toHaveBeenCalledWith('Mapped {* * * * 10} schedule job');
    expect(loggerInfoSpy).toHaveBeenCalledWith('Mapped {* * * * *} schedule job');
    expect(loggerInfoSpy).toHaveBeenCalledWith('Mapped {* * * * 5} schedule job');
    expect(loggerInfoSpy).toHaveBeenCalledWith('Mapped {* * * * *} schedule job');
  });

  it('should call the start method on each job on application listen', async () => {
    const fooJob = new Job({ callback: jest.fn(), expression: '* * * * *', name: 'foo' });
    const barJob = new Job({ callback: jest.fn(), expression: '* * * * *', name: 'foo' });

    const scheduleManager = new ScheduleManager(await Injector.create([]), new Schedule(fooJob, barJob));

    const fooJobStartSpy = jest.spyOn(fooJob, 'start').mockImplementation(jest.fn());
    const barJobStartSpy = jest.spyOn(barJob, 'start').mockImplementation(jest.fn());

    expect(fooJobStartSpy).not.toHaveBeenCalled();
    expect(barJobStartSpy).not.toHaveBeenCalled();

    await scheduleManager.onApplicationListen();

    expect(fooJobStartSpy).toHaveBeenCalledTimes(1);
    expect(barJobStartSpy).toHaveBeenCalledTimes(1);
  });

  it('should call the stop method on each job on application shutdown', async () => {
    const fooJob = new Job({ callback: jest.fn(), expression: '* * * * *', name: 'foo' });
    const barJob = new Job({ callback: jest.fn(), expression: '* * * * *', name: 'foo' });

    const scheduleManager = new ScheduleManager(await Injector.create([]), new Schedule(fooJob, barJob));

    const fooJobStopSpy = jest.spyOn(fooJob, 'stop').mockImplementation(jest.fn());
    const barJobStopSpy = jest.spyOn(barJob, 'stop').mockImplementation(jest.fn());

    expect(fooJobStopSpy).not.toHaveBeenCalled();
    expect(barJobStopSpy).not.toHaveBeenCalled();

    await scheduleManager.onApplicationShutdown();

    expect(fooJobStopSpy).toHaveBeenCalledTimes(1);
    expect(barJobStopSpy).toHaveBeenCalledTimes(1);
  });
});
