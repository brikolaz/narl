export type Enum = Record<string, string | number>;
export type EnumType<T extends Enum> = T[keyof T];
