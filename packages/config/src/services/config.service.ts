import { Injectable } from '@artisanjs/core';
import * as dotenv from 'dotenv';
import get from 'lodash.get';
import { join } from 'path';

@Injectable()
export class Config {
  private readonly parsed: dotenv.DotenvParseOutput;

  constructor() {
    const result = dotenv.config({
      path: join(process.cwd(), '.env'),
    });

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
