export interface Control {
  readonly parent?: Control;
  readonly root?: Control;
  readonly value: any;
}
