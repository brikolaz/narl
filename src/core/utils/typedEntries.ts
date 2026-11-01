export const typedEntries = <Key extends string | number | symbol, Value>(
  obj: Partial<Record<Key, Value>>,
) => Object.entries(obj) as [Key, Value][]
