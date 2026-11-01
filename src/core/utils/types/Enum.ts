type Enum<Value extends string = string> = Record<string, Value>

export type EnumType<EnumObject extends Enum> = EnumObject[keyof EnumObject]

export const createEnum = <const Values extends readonly (string | number)[]>(
  ...values: Values
) =>
  Object.fromEntries(values.map((value) => [value, value])) as {
    [Value in Values[number]]: Value
  }
