import type { Entity, EntityRole } from "../../Entity";
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

  const parent = record.parent;
  if (parent !== null && record.role !== null) {
    const siblings = getEntitiesByRole(parent, record.role);
    parent.entityByRole.set(
      record.role,
      new Set(siblings.filter((entity) => entity.id !== id)),
    );
    parent.entityById.delete(id);
  }

  for (const componentId of record.entity.componentById.keys()) {
    removeComponentById(componentId);
  }

  for (const childId of [...record.entity.entityById.keys()]) {
    removeDataEntityById(childId);
  }
};

export const removeEntityById = (id: Id) => {
  removeDataEntityById(id);
  removeEntityRegistryRecordById(id);
};

export const removeEntitiesByRole = (
  entity: Entity,
  ...roles: EntityRole[]
): void => {
  for (const role of roles) {
    const entities = getEntitiesByRole(entity, role);

    for (const child of entities) {
      removeEntityById(child.id);
    }
  }
};
