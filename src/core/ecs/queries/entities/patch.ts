import type { Entity } from "../../Entity";
import type { Id } from "../../Id";
import { getEntityById } from "./get";

const patchDataEntityById = (
  id: Id,
  patcher: (child: Entity) => void,
): void => {
  const entity = getEntityById(id);
  if (!entity) {
    return;
  }
  patcher(entity);
};

export const patchEntityById = (
  id: Id,
  patcher: (child: Entity) => void,
): void => {
  patchDataEntityById(id, patcher);
};
