import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Environment } from '../../src/lib/services/environment';

jest.mock('dotenv');
jest.mock('fs');

describe('Environment', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should not load the contents of the .env file if it does not exist', () => {
    const dotenvParseSpy = jest.spyOn(dotenv, 'parse');

    new Environment();

    expect(dotenvParseSpy).not.toHaveBeenCalled();
  });

  it('should load the contents of the .env file if it exists', () => {
    const buffer = Buffer.from('FOO=BAR');

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readFileSync').mockReturnValue(buffer);

    const dotenvParseSpy = jest.spyOn(dotenv, 'parse');

    new Environment();

    expect(dotenvParseSpy).toHaveBeenNthCalledWith(1, buffer);
  });

  it('should return the correct property if there is a conflict between process.env and the contents of the .env file', () => {
    process.env['FOO'] = '1';

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(dotenv, 'parse').mockReturnValue({ FOO: '2', BAR: '2' });

    const environment = new Environment();

    expect(environment.get('FOO', '3')).toEqual('1');
    expect(environment.get('BAR', '3')).toEqual('2');
    expect(environment.get('BAZ', '3')).toEqual('3');

    delete process.env['FOO'];
  });

  it('should return a default value if the environment does not exist', () => {
    const environment = new Environment();

    expect(environment.get('FOO', 'DEFAULT_VALUE')).toEqual('DEFAULT_VALUE');
  });
});
