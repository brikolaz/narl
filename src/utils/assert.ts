export function assert<T>(
  condition: T,
  message: string,
): NonNullable<T> {
  if (!condition) {
    throw new Error(message);
  }

  return condition;
}
