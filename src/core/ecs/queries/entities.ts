import type { Constructor } from "../Constructor";
import type { Entity } from "../Entity";

export const getEntityById = (
  entity: Entity,
  childEntityId: string,
): Entity | undefined =>
  entity.entities.find((child) => child.id === childEntityId);

export const getEntityByType = <T extends Entity>(
  entity: Entity | undefined,
  entityClass: Constructor<T>,
): T | undefined => {
  return entity?.entities?.find(
    (entity): entity is T => entity instanceof entityClass,
  );
};

export const getEntitiesByType = <T extends Entity>(
  entity: Entity | undefined,
  entityClass: Constructor<T>,
): T[] => {
  return (
    entity?.entities?.filter(
      (entity): entity is T => entity instanceof entityClass,
    ) ?? []
  );
};

export const hasEntityById = (entity: Entity, childEntityId: string): boolean =>
  entity.entities.some((child) => child.id === childEntityId);

export const addEntities = (entity: Entity, ...children: Entity[]): Entity => {
  entity.entities.push(...children);
  return entity;
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

// export const upsertEntityById = (
//   entity: Entity,
//   nextChild: Entity
// ): Entity => {
//   const exists = entity.entities.some((child) => child.id === nextChild.id);

//   return exists
//     ? replaceEntityById(entity, nextChild.id, nextChild)
//     : addEntity(entity, nextChild);
// };
