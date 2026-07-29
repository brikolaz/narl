export type AbstractConstructor<T> = abstract new (...args: any[]) => T;
export type ConcreteConstructor<T> = new (...args: any[]) => T;
export type Constructor<T> = AbstractConstructor<T> | ConcreteConstructor<T>;
