import type { Id } from "../core/ecs/Id";

export const removeById = <T extends { id: Id }>(arr: T[], id: Id) => {
  const index = arr.findIndex((el) => el.id === id);
  if (index !== -1) {
    arr.splice(index, 1);
  }
};
