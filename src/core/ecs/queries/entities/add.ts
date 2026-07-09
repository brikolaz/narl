import { EntityRole, type Entity } from "../../Entity";
import type { Id } from "../../Id";
import { upsertRegistryEntities } from "../../registry/entityRegistry";
import { getEntityById } from "./get";

const getTargetEntity = (
  entity: Entity | Id | undefined,
): Entity | undefined => {
  if (entity === undefined) {
    return undefined;
  }

  return typeof entity === "number" ? getEntityById(entity) : entity;
};

type ChildrenInput =
  | (Entity | undefined)[]
  | Partial<Record<EntityRole, (Entity | undefined)[] | Entity>>;

const normalizeChildren = (
  children: ChildrenInput,
): Partial<Record<EntityRole, Entity[]>> => {
  if (Array.isArray(children)) {
    return {
      [EntityRole.DEFAULT]: children.filter(
        (child): child is Entity => child !== undefined,
      ),
    };
  }

  const normalized: Partial<Record<EntityRole, Entity[]>> = {};

  for (const [role, entities] of Object.entries(children)) {
    normalized[role as EntityRole] = [entities]
      .flat()
      .filter((child): child is Entity => child !== undefined);
  }

  return normalized;
};

const upsertDataEntities = (
  entity: Entity,
  children: Partial<Record<EntityRole, Entity[]>>,
): void => {
  for (const [entityRole, entities] of Object.entries(children)) {
    const nextIds = entity.entityByRole.get(entityRole as EntityRole) ?? [];
    for (const child of entities) {
      nextIds.push(child.id);
      entity.entityById.set(child.id, child);
    }
    entity.entityByRole.set(entityRole as EntityRole, nextIds);
  }

};

const _upsertEntities = (
  entity: Entity | Id | undefined,
  childrenEntities: ChildrenInput,
): void => {
  const target = getTargetEntity(entity);
  if (!target) {
    return;
  }
  const children = normalizeChildren(childrenEntities);
  upsertDataEntities(target, children);
  upsertRegistryEntities(target, children);
};

export const upsertEntities = (
  entity: Entity | Id | undefined,
  ...childrenEntities: (undefined | Entity)[]
): void => {
  _upsertEntities(entity, childrenEntities);
};

export const upsertRoleEntities = (
  entity: Entity | Id | undefined,
  childrenEntities: Partial<
    Record<EntityRole, (Entity | undefined)[] | Entity>
  >,
): void => {
  _upsertEntities(entity, childrenEntities);
};
