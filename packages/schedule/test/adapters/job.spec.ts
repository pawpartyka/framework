import { CronJob, CronTime } from 'cron';
import moment from 'moment';
import { Job } from '../../src/lib/adapters/job';

jest.mock('cron');

describe('Job', () => {
  const callback = jest.fn();
  const expression = '* * * * *';
  const name = 'Foo';
  const timeZone = 'America/Los_Angeles';
  const unrefTimeout = true;
  const utcOffset = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use CronJob', () => {
    new Job({ callback, expression, name, timeZone, unrefTimeout, utcOffset });

    expect(CronJob).toHaveBeenNthCalledWith(1, expression, callback, null, false, timeZone, null, false, utcOffset, unrefTimeout);
  });

  describe('name property', () => {
    it('should return correctly name', () => {
      expect(new Job({ callback, expression, name }).name).toEqual(name);
    });
  });

  describe('running property', () => {
    it('should return false if the job is not running', () => {
      expect(new Job({ callback, expression, name }).running).toBeFalsy();
    });

    it('should return true if the job is running', () => {
      jest
        .spyOn(CronJob.prototype, 'start')
        .mockImplementation(function () {
          this.running = true;
        });

      const job = new Job({ callback, expression, name });

      job.start();

      expect(job.running).toBeTruthy();
    });
  });

  describe('start method', () => {
    it('should call the start method in CronJob', () => {
      const startSpy = jest.spyOn(CronJob.prototype, 'start').mockImplementation(jest.fn());

      new Job({ callback, expression, name }).start();

      expect(startSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('stop method', () => {
    it('should call the stop method in CronJob', () => {
      const stopSpy = jest.spyOn(CronJob.prototype, 'stop').mockImplementation(jest.fn());

      new Job({ callback, expression, name }).stop();

      expect(stopSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('setTime method', () => {
    it('should call the setTime method in CronJob', () => {
      const setTimeSpy = jest.spyOn(CronJob.prototype, 'setTime');
      const job = new Job({ callback, expression, name });
      const source = Date();

      job.setTime(source, timeZone, utcOffset);

      expect(setTimeSpy).toHaveBeenNthCalledWith(1, expect.any(CronTime));
      expect(CronTime).toHaveBeenNthCalledWith(1, source, timeZone, utcOffset);
    });
  });

  describe('lastDate method', () => {
    it('should call the lastDate method in CronJob', () => {
      const lastDateSpy = jest.spyOn(CronJob.prototype, 'lastDate');

      new Job({ callback, expression, name }).lastDate();

      expect(lastDateSpy).toHaveBeenCalledTimes(1);
    });

    it('should return the date if lastDate in CronJob return date', () => {
      const lastDate = new Date();

      jest
        .spyOn(CronJob.prototype, 'lastDate')
        .mockReturnValue(lastDate);

      expect(new Job({ callback, expression, name }).lastDate()).toEqual(lastDate);
    });

    it('should return undefined if lastDate in CronJob return undefined', () => {
      jest
        .spyOn(CronJob.prototype, 'lastDate')
        .mockReturnValue(undefined);

      expect(new Job({ callback, expression, name }).lastDate()).toBeUndefined();
    });
  });

  describe('nextDates method', () => {
    it('should call the nextDates method in CronJob', () => {
      const nextDatesSpy = jest.spyOn(CronJob.prototype, 'nextDates');

      new Job({ callback, expression, name }).nextDates(10);

      expect(nextDatesSpy).toHaveBeenNthCalledWith(1, 10);
    });

    it('should return date if nextDates in CronJob return date', () => {
      const lastDate = moment();

      jest
        .spyOn(CronJob.prototype, 'nextDates')
        .mockReturnValue(lastDate);

      expect(new Job({ callback, expression, name }).nextDates()).toEqual(lastDate.toDate());
    });

    it('should return dates if nextDates in CronJob return dates', () => {
      const lastDates = [moment(), moment()];

      jest
        .spyOn(CronJob.prototype, 'nextDates')
        .mockReturnValue(lastDates);

      expect(new Job({ callback, expression, name }).nextDates()).toEqual(lastDates.map(it => it.toDate()));
    });

    it('should return undefined if nextDates in CronJob return undefined', () => {
      jest
        .spyOn(CronJob.prototype, 'nextDates')
        .mockReturnValue(undefined);

      expect(new Job({ callback, expression, name }).nextDates()).toBeUndefined();
    });
  });
});
