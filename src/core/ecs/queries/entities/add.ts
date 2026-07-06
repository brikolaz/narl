import { Entity, EntityRole } from "../../Entity";
import type { Id } from "../../Id";
import { upsertRegistryEntities } from "../../registry/entityRegistry";
import { getEntityById } from "./get";

const addDataEntities = (
  entity: Entity | Id | undefined,
  children: Partial<Record<EntityRole, Entity[]>> | Entity[],
): void => {
  if (entity === undefined) {
    return;
  }
  const source = typeof entity === "string" ? getEntityById(entity) : entity;
  if (!source) {
    return;
  }
  if (Array.isArray(children)) {
    const nextIds = source.entityByRole.get(EntityRole.DEFAULT) ?? [];
    for (const child of children) {
      nextIds.push(child.id);
      source.entityById.set(child.id, child);
    }
    source.entityByRole.set(EntityRole.DEFAULT, nextIds);
    return;
  }
  for (const [entityRole, entities] of Object.entries(children)) {
    const nextIds = source.entityByRole.get(entityRole as EntityRole) ?? [];
    for (const child of entities) {
      nextIds.push(child.id);
      source.entityById.set(child.id, child);
    }
    source.entityByRole.set(entityRole as EntityRole, nextIds);
  }
};

export const addEntities = (
  entity: Entity | undefined,
  childrenEntities: Record<EntityRole, Entity[]> | Entity[],
): void => {
  if (!entity) {
    return;
  }
  addDataEntities(entity, childrenEntities);
  upsertRegistryEntities(entity, childrenEntities);
};
