import { TestingLogger } from '../src/lib/testing-logger';
import { Logger } from '../src/lib/logger';

describe('TestingLogger', () => {
  let testingLogger: TestingLogger;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeAll(() => {
    testingLogger = new TestingLogger(TestingLogger.name);
  });

  it('should extends Logger', () => {
    expect(testingLogger).toBeInstanceOf(Logger);
  });

  describe('debug method', () => {
    it('should not call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write');

      testingLogger.debug('foo');

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('error method', () => {
    it('should not call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write');

      testingLogger.error('foo');

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('info method', () => {
    it('should not call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write');

      testingLogger.info('foo');

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('trace method', () => {
    it('should not call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write');

      testingLogger.trace('foo');

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });

  describe('warn method', () => {
    it('should not call process.stdout.write', () => {
      const writeSpy = jest.spyOn(process.stdout, 'write');

      testingLogger.warn('foo');

      expect(writeSpy).not.toHaveBeenCalled();
    });
  });
});
