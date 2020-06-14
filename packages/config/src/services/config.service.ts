import { Injectable } from '@artisanjs/core';
import * as dotenv from 'dotenv';
import expand from 'dotenv-expand';
import get from 'lodash.get';
import { join } from 'path';

@Injectable()
export class ConfigService {
  private readonly parsed: dotenv.DotenvParseOutput;

  constructor() {
    const result = expand(dotenv.config({
      path: join(process.cwd(), '.env'),
    }));

    if (result.error) {
      throw result.error;
    }

    if (result.parsed) {
      this.parsed = result.parsed;
    }
  }

  public get(name: string, defaultValue?: any): any {
    return get(this.parsed, name, defaultValue);
  }
}
