import type { Id } from "../../Id";
import {
  getEntityRegistryRecordById,
  removeEntityRegistryRecordById,
} from "../../registry/entityRegistry";
import { removeComponentById } from "../components/remove";
import { getEntitiesByRole } from "./get";

export const removeDataEntityById = (id: Id): void => {
  const record = getEntityRegistryRecordById(id);
  if (!record) return;

  if (record.parent !== null && record.role !== null) {
    const parentRecord = getEntityRegistryRecordById(record.parent);
    if (!parentRecord) {
      throw new Error(`No parent record in registry`);
    }
    const siblings = getEntitiesByRole(parentRecord.entity, record.role);
    parentRecord?.entity.entityByRole.set(
      record.role,
      siblings.filter((entity) => entity.id !== id).map((entity) => entity.id),
    );
    parentRecord?.entity.componentById.delete(id);
  }

  for (const componentId of record.entity.componentById.keys()) {
    removeComponentById(componentId);
  }

  for (const childId of record.entity.entityById.keys()) {
    removeDataEntityById(childId);
  }
};

export const removeEntityById = (id: Id) => {
  removeDataEntityById(id);
  removeEntityRegistryRecordById(id);
};
