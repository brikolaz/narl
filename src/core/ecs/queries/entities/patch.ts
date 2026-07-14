import { EntityRole, type Entity } from "../../Entity";
import type { Id } from "../../Id";
import {
  getEntityRegistryRecordById,
  upsertEntityRegistryRecords
} from "../../registry/entityRegistry";
import { upsertEntities } from "./add";
import { getEntityById } from "./get";
import { removeEntityById } from "./remove";

const patchDataEntityById = (
  id: Id,
  patcher: (child: Entity) => void,
): void => {
  const entity = getEntityById(id);
  if (!entity) {
    return;
  }
  patcher(entity);
};

export const patchEntityById = (
  id: Id,
  patcher: (child: Entity) => void,
): void => {
  patchDataEntityById(id, patcher);
};

export const replaceEntityById = (oldEntity: Id, nextEntity: Entity): void => {
  const record = getEntityRegistryRecordById(oldEntity);

  if (!record) {
    return;
  }

  const parent =
    record.parent === null
      ? undefined
      : getEntityRegistryRecordById(record.parent)?.entity;

  if (!parent) {
    upsertEntities(nextEntity);
    return;
  }

  const role = record.role ?? EntityRole.DEFAULT;

  parent.entityById.set(nextEntity.id, nextEntity);
  parent.entityByRole.set(
    role,
    parent.entityByRole.get(role)?.map((sibling) => {
      if (sibling === oldEntity) {
        return nextEntity.id;
      }
      return sibling;
    }) ?? [],
  );
  removeEntityById(oldEntity);
  upsertEntityRegistryRecords({
    parent: parent.id,
    entity: nextEntity,
    role,
  });
};
