export interface TypeProvider<T = any> {
  new(...args: any): T;
}
