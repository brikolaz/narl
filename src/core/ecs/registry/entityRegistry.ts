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
type EntityRegistryById = {
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
  childrenEntities: Partial<Record<EntityRole, Entity[]>> | Entity[],
) => {
  if (!entity) {
    return;
  }
  const records: EntityRegistryRecord[] = [];
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
  ENTITY_REGISTRY_BY_ID[id] = patcher(ENTITY_REGISTRY_BY_ID[id]);
};
