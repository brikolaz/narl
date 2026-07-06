export type Widen<T> =
  T extends string ? string :
  T extends number ? number :
  T extends symbol ? symbol :
  T;

export type WidenProps<T extends object> = {
  [K in keyof T]: Widen<T[K]>;
};