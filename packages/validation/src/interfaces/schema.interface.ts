import { Type } from '@artisanjs/core';
import { Rule } from './rule.interface';

export interface Constraint {
  args?: unknown[];
  message?: string; // string | () => string ?????
  name: string | symbol;
  rule: Type<Rule>;
}

export type Schema = Constraint[] | { [path: string]: Constraint[] };
