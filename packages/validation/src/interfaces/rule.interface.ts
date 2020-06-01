export interface Rule {
  implicit?: boolean;

  (value: any, index: string, target: any): null | string | string[] | Promise<null | string | string[]>;
}

export interface RuleOptions {
  message?: string;
}
