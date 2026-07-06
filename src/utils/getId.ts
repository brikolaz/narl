import type { Id } from "../core/ecs/Id";

let id = 0;
export const getId = (): Id => ++id;
