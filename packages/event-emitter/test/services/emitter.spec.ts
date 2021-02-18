import { Emitter } from '../../src/lib/services/emitter';

describe('Emitter', () => {
  it('should invoke certain event handlers', async () => {
    const engineStartSpy = jest.fn();

    const emitter: Emitter = new Emitter([
      {
        event: 'engine.start',
        handler: engineStartSpy,
      },
    ]);

    await emitter.emit('engine.start');
    await emitter.emit('engine.start', 'hello');

    expect(engineStartSpy).toHaveBeenCalledTimes(2);
    expect(engineStartSpy).toHaveBeenCalledWith('hello');
  });

  it('should invoke certain event handlers with wildcards', async () => {
    const engineWildcardSpy = jest.fn();
    const engineStartSpy = jest.fn();

    const emitter: Emitter = new Emitter([
      {
        event: 'engine.*',
        handler: engineWildcardSpy,
      },
      {
        event: 'engine.start',
        handler: engineStartSpy,
      },
    ]);

    await emitter.emit('engine.test', 'hello');
    await emitter.emit('engine.start', 'world');

    expect(engineWildcardSpy).toHaveBeenCalledTimes(2);
    expect(engineWildcardSpy).toHaveBeenCalledWith('hello');
    expect(engineWildcardSpy).toHaveBeenCalledWith('world');
    expect(engineStartSpy).toHaveBeenNthCalledWith(1, 'world');
  });

  it('should wait for the promises in the event handlers to be resolved', async () => {
    let result: string;

    const emitter: Emitter = new Emitter([
      {
        event: 'engine.start',
        handler: async () => {
          result = await new Promise(resolve => setTimeout(() => resolve('OK'), 1000));
        },
      },
    ]);

    await emitter.emit('engine.start');

    expect(result).toEqual('OK');
  });

  it('should throw an exception if any event handler throws an error', () => {
    const emitter: Emitter = new Emitter([
      {
        event: 'engine.start',
        handler: jest.fn().mockImplementation(() => {
          throw new Error('failed');
        }),
      },
    ]);

    expect(emitter.emit('engine.start')).rejects.toThrowError('failed');
  });
});
