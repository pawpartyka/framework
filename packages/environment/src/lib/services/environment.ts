import { Injectable } from '@artisanjs/core';
import { parse } from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class Environment {
  private readonly parsed: { [name: string]: string } = {};

  constructor() {
    const path = resolve(process.cwd(), '.env');

    if (existsSync(path)) {
      this.parsed = parse(readFileSync(path));
    }
  }

  public get<T>(name: string, defaultValue?: any): T {
    return process.env[name] || this.parsed[name] || defaultValue;
  }
}
