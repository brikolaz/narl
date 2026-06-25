export type Factory<T> = {
  getDefault: () => T;
  curse?: (item: T) => boolean
  shouldBeCursed?: (item: T) => boolean;
};
