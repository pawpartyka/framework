import { Control } from './control.interface';

export interface Rule {
  (control: Control): null | string | string[] | Promise<null | string | string[]>;
}

export interface RuleOptions {
  message?: string;
}
