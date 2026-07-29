import type { Entity, EntityRole } from "../../Entity";
import type { Id } from "../../Id";
import { getRegistryEntityById } from "../../registry/entityRegistry";
import { resolveEntity, type EntityArgument } from "./normalize";

export const getEntityById = (id: Id) => {
  return getRegistryEntityById(id);
};

export const getEntitiesByRole = (
  parentEntity: EntityArgument,
  entityRole: EntityRole,
): Entity[] => {
  if (!parentEntity) {
    return [];
  }
  const source = resolveEntity(parentEntity);
  const entities = [...(source?.entityByRole.get(entityRole) ?? [])];
  return entities.filter(
    (targetEntity): targetEntity is Entity => targetEntity !== undefined,
  );
};

export const getEntityByRole = (
  parentEntity: EntityArgument,
  entityRole: EntityRole,
): Entity => {
  return getEntitiesByRole(parentEntity, entityRole)[0];
};
