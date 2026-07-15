import { EntityRole, type Entity } from "../Entity";
import type { Id } from "../Id";

export type EntityRegistryRecord =
  | {
      entity: Entity;
      parent: null;
      role: null;
    }
  | {
      entity: Entity;
      parent: Id;
      role: EntityRole;
    };

export type EntityRegistryById = {
  [id: Id]: EntityRegistryRecord;
};

export const ENTITY_REGISTRY_BY_ID: EntityRegistryById = {};

export const upsertEntityRegistryRecords = (
  ...records: EntityRegistryRecord[]
) => {
  for (const record of records) {
    ENTITY_REGISTRY_BY_ID[record.entity.id] = record;
  }
};

export const upsertRegistryEntities = (
  entity: Entity | undefined,
  childrenEntities: Partial<Record<EntityRole, Entity[]>> | Entity[] = [],
) => {
  if (!entity) {
    return;
  }
  const records: EntityRegistryRecord[] = [];
  if (!hasEntityRegistryRecord(entity.id)) {
    records.push({
      entity,
      parent: null,
      role: null,
    });
  }
  const entitiesToRegister = Array.isArray(childrenEntities)
    ? { [EntityRole.DEFAULT]: childrenEntities }
    : childrenEntities;
  for (const [role, children] of Object.entries(entitiesToRegister)) {
    for (const child of children) {
      records.push({
        parent: entity.id,
        entity: child,
        role: role as EntityRole,
      });
    }
  }
  upsertEntityRegistryRecords(...records);
};

export const hasEntityRegistryRecord = (id: Id) => {
  return ENTITY_REGISTRY_BY_ID[id] !== undefined;
};
export const getEntityRegistryRecordById = (
  id: Id,
): EntityRegistryRecord | undefined => {
  return ENTITY_REGISTRY_BY_ID[id];
};

export const getRegistryEntityById = (id: Id): Entity | undefined => {
  return ENTITY_REGISTRY_BY_ID[id]?.entity;
};

export const removeEntityRegistryRecordById = (id: Id): void => {
  delete ENTITY_REGISTRY_BY_ID[id];
};

export const patchEntityRegistryRecordById = (
  id: Id,
  patcher: (record: EntityRegistryRecord) => EntityRegistryRecord,
): void => {
  if (!hasEntityRegistryRecord(id)) {
    return;
  }
  const nextRecord = patcher(ENTITY_REGISTRY_BY_ID[id]);
  ENTITY_REGISTRY_BY_ID[nextRecord.entity.id] = nextRecord;
  if (id !== nextRecord.entity.id) {
    removeEntityRegistryRecordById(id);
  }
};

export const detachRegistryEntity = (id: Id) => {
  const record = getEntityRegistryRecordById(id);

  if (!record) {
    return;
  }

  const parent =
    record.parent === null
      ? undefined
      : getEntityRegistryRecordById(record.parent)?.entity;

  if (!parent) {
    return;
  }

  const role = record.role ?? EntityRole.DEFAULT;

  parent.entityById.delete(id);
  parent.entityByRole.set(
    role,
    parent.entityByRole.get(role)?.filter((sibling) => {
      return sibling !== id;
    }) ?? [],
  );

  patchEntityRegistryRecordById(id, (r) => ({
    ...r,
    parent: null,
    role: null,
  }));
};
