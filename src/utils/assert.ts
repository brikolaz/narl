export function assert(condition: boolean, message: string): asserts condition

export function assert<Value>(
  condition: Value,
  message: string,
): NonNullable<Value>

export function assert<Value>(
  condition: Value,
  message: string,
): NonNullable<Value> {
  if (!condition) {
    throw new Error(message)
  }

  return condition
}
