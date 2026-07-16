import { type Entity } from "../../Entity";
import { resolveEntity, type EntityArgument } from "./normalize";

const patchDataEntity = (
  entity: Entity,
  patcher: (entity: Entity) => void,
): void => {
  patcher(entity);
};

export const patchEntity = (
  entity: EntityArgument,
  patcher: (entity: Entity) => void,
): void => {
  const target = resolveEntity(entity);
  if (!target) {
    return;
  }
  patchDataEntity(target, patcher);
};
