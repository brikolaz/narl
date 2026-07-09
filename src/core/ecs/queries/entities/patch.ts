import { type Entity } from "../../Entity";
import type { Id } from "../../Id";
import {
  getEntityRegistryRecordById,
  upsertRegistryEntities,
} from "../../registry/entityRegistry";
import { upsertRoleEntities } from "./add";
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

export const replaceEntityById = (id: Id, nextEntity: Entity): void => {
  const record = getEntityRegistryRecordById(id);

  if (!record) {
    return;
  }

  const parent =
    record.parent === null
      ? undefined
      : getEntityRegistryRecordById(record.parent)?.entity;

  if (record.parent !== null && (!parent || record.role === null)) {
    throw new Error("No parent record in registry");
  }

  removeEntityById(id);

  if (parent && record.role !== null) {
    upsertRoleEntities(parent, { [record.role]: nextEntity });
    return;
  }

  upsertRegistryEntities(nextEntity);
};
