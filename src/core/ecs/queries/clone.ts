export const clone = <T>(obj: T): T =>
  Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    obj
  );