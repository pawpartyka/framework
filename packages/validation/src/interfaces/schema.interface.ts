import { Type } from '@artisanjs/core';
import { Rule } from './rule.interface';

export interface Constraint {
  args?: unknown[];
  message?: string;
  name: string | symbol;
  rule: Type<Rule>;
}

export interface Schema {
  [path: string]: Constraint[];
}
