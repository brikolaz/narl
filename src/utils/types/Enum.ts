export type Enum<T extends string | number = string | number> = Record<
  string,
  T
>;
export type EnumType<T extends Enum> = T[keyof T];
