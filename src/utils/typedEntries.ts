export const typedEntries = <K extends string | number | symbol, V>(
  obj: Partial<Record<K, V>>,
) => Object.entries(obj) as [K, V][];
