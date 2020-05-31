export interface Constraint {
  (value: any, index: string, target: any): boolean | string | Promise<boolean | string>;
}

export type Schema = Constraint[] | { [expression: string]: Constraint[] };
