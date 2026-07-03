import { isArray } from "lodash";
import { EntityRole, type Entity } from "../Entity";

export const getEntityById = (
  entity: Entity,
  childEntityId: string,
): Entity | undefined =>
  entity.entities.find((child) => child.id === childEntityId);

export const getEntityByRole = (
  entity: Entity | undefined,
  entityRole: EntityRole,
): Entity | undefined => {
  return entity?.entities.get(entityRole)?.[0];
};

export const getEntitiesByRole = (
  entity: Entity | undefined,
  entityRole: EntityRole,
): Entity[] => {
  return entity?.entities.get(entityRole) ?? [];
};

export const hasEntityById = (entity: Entity, childEntityId: string): boolean =>
  entity.entities.some((child) => child.id === childEntityId);

export const addEntities = (
  entity: Entity | undefined,
  children: Record<EntityRole, Entity[]> | Entity[],
): void => {
  if (!entity) {
    return;
  }
  if (isArray(children)) {
    const nextEntities = entity.entities.get(EntityRole.DEFAULT) ?? [];
    nextEntities.push(...children);
    entity.entities.set(EntityRole.DEFAULT, nextEntities);
    return;
  }
  for (const [entityRole, entities] of Object.entries(children)) {
    const nextEntities = entity.entities.get(entityRole as EntityRole) ?? [];
    nextEntities.push(...entities);
    entity.entities.set(entityRole as EntityRole, nextEntities);
  }
};

export const removeEntityById = (
  entity: Entity,
  childEntityId: string,
): void => {
  const nextEntities = entity.entities.filter(
    (child) => child.id !== childEntityId,
  );
  if (nextEntities.length !== entity.entities.length)
    entity.entities = nextEntities;
};

export const replaceEntityById = (
  entity: Entity,
  childEntityId: string,
  nextChild: Entity,
): Entity => {
  let replaced = false;
  const nextChildEntities = entity.entities.map((child) => {
    if (child.id !== childEntityId) return child;
    replaced = true;
    return nextChild;
  });
  if (!replaced) return entity;

  entity.entities = nextChildEntities;
  return entity;
};

export const patchEntityById = (
  entity: Entity,
  childEntityId: string,
  patcher: (child: Entity) => Entity,
): void => {
  let changed = false;
  const nextEntities = entity.entities.map((child) => {
    if (child.id !== childEntityId) return child;
    changed = true;

    return patcher(child);
  });
  if (changed) entity.entities = nextEntities;
};
