import type { Entity, EntityRole } from "../../Entity";
import type { Id } from "../../Id";
import { getRegistryEntityById } from "../../registry/entityRegistry";

export const getEntityById = (id: Id) => {
  return getRegistryEntityById(id);
};

export const getEntitiesByRole = (
  entity: Entity | Id | undefined,
  entityRole: EntityRole,
): Entity[] => {
  if (!entity) {
    return [];
  }
  const source = typeof entity === "number" ? getEntityById(entity) : entity;
  const entities = [...(source?.entityByRole.get(entityRole) ?? [])];
  return entities.filter(
    (targetEntity): targetEntity is Entity => targetEntity !== undefined,
  );
};

export const getEntityByRole = (
  entity: Entity | Id | undefined,
  entityRole: EntityRole,
): Entity => {
  return getEntitiesByRole(entity, entityRole)[0];
};
