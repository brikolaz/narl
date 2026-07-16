import { EntityRole, type Entity } from "../../Entity";
import type { Id } from "../../Id";
import { upsertRegistryEntities } from "../../registry/entityRegistry";
import { resolveEntity, normalizeChildrenEntityRecords, type ChildrenInput } from "./normalize";

const upsertDataEntities = (
  entity: Entity,
  children: Partial<Record<EntityRole, Entity[]>>,
): void => {
  for (const [entityRole, entities] of Object.entries(children)) {
    for (const child of entities) {
      entity.entityById.set(child.id, child);
      entity.entityByRole.set(
        entityRole as EntityRole,
        (entity.entityByRole.get(entityRole as EntityRole) ?? new Set())?.add(
          child,
        ),
      );
    }
  }
};

const _upsertEntities = (
  entity: Entity | Id | undefined,
  childrenEntities: ChildrenInput,
): void => {
  const target = resolveEntity(entity);
  if (!target) {
    return;
  }
  const children = normalizeChildrenEntityRecords(childrenEntities);
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
