export interface Control {
  readonly parent: Control | null;
  readonly property: string | null;
  readonly root: Control;
  readonly value: any;
}
