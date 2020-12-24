import { Logger } from '../src/lib/logger';

describe('Logger', () => {
  let logger: Logger;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    logger = new Logger(Logger.name);
  });

  describe('debug method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.debug('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('error method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.error('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('info method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.info('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('trace method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.trace('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('warn method', () => {
    it('should call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn());

      logger.warn('foo');

      expect(writeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
