import { Logger } from '../src/lib/logger';
import { LoggerFactory } from '../src/lib/logger-factory';

class SampleLogger extends Logger {
}

describe('LoggerFactory', () => {
  afterEach(() => {
    LoggerFactory.useLogger(Logger);
  });

  it('should set loggerRef correctly', () => {
    LoggerFactory.useLogger(SampleLogger);

    expect(LoggerFactory.getLogger(SampleLogger.name)).toBeInstanceOf(SampleLogger);
  });
});
