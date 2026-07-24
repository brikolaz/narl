import { STATE } from "../../../game/state/state";
import { typedEntries } from "../../../utils/typedEntries";
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
      parent: Entity;
      role: EntityRole;
    };

export type EntityRegistryById = {
  [id: Id]: EntityRegistryRecord;
};

export const upsertEntityRegistryRecords = (
  ...records: EntityRegistryRecord[]
) => {
  for (const record of records) {
    STATE.entityRegistryById[record.entity.id] = record;
  }
};

export const upsertRegistryEntities = (
  parentEntity: Entity | undefined,
  childrenEntities: Partial<Record<EntityRole, Entity[]>> | Entity[] = [],
) => {
  if (!parentEntity) {
    return;
  }
  const records: EntityRegistryRecord[] = [];
  if (!hasEntityRegistryRecord(parentEntity.id)) {
    records.push({
      entity: parentEntity,
      parent: null,
      role: null,
    });
  }
  const entitiesToRegister = Array.isArray(childrenEntities)
    ? { [EntityRole.DEFAULT]: childrenEntities }
    : childrenEntities;
  for (const [role, children] of typedEntries(entitiesToRegister)) {
    for (const child of children) {
      records.push({
        parent: parentEntity,
        entity: child,
        role: role as EntityRole,
      });
    }
  }
  upsertEntityRegistryRecords(...records);
};

export const hasEntityRegistryRecord = (id: Id) => {
  return STATE.entityRegistryById[id] !== undefined;
};

export const getEntityRegistryRecordById = (
  id: Id,
): EntityRegistryRecord | undefined => {
  return STATE.entityRegistryById[id];
};

export const getRegistryEntityById = (id: Id): Entity | undefined => {
  return STATE.entityRegistryById[id]?.entity;
};

export const removeEntityRegistryRecordById = (id: Id): void => {
  delete STATE.entityRegistryById[id];
};

export const patchEntityRegistryRecordById = (
  entity: Id,
  patcher: (record: EntityRegistryRecord) => EntityRegistryRecord,
): void => {
  if (!hasEntityRegistryRecord(entity)) {
    return;
  }
  const nextRecord = patcher(STATE.entityRegistryById[entity]);
  STATE.entityRegistryById[nextRecord.entity.id] = nextRecord;
  if (entity !== nextRecord.entity.id) {
    removeEntityRegistryRecordById(entity);
  }
};
