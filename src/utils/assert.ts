export function assert(condition: boolean, message: string): asserts condition;

export function assert<T>(condition: T, message: string): NonNullable<T>;

export function assert<T>(condition: T, message: string): NonNullable<T> {
  if (!condition) {
    throw new Error(message);
  }

  return condition as NonNullable<T>;
}
