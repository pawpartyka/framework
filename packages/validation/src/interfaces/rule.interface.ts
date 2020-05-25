export interface Rule {
  message(args: any[], value: any, index: string, target: any): string | Promise<string>;
  passes(args: any[], value: any, index: string, target: any): boolean | Promise<boolean>;
}
