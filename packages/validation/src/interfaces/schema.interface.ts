export interface Constraint {
  implicit?: boolean;

  (value: any, index: string, target: any): boolean | string | Promise<boolean | string>;
}

export interface Schema {
  [expression: string]: Constraint[];
}
