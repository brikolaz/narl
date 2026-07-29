import { EntityRole, type Entity } from "../../Entity";
import type { Id } from "../../Id";
import {
  getEntityRegistryRecordById,
  patchEntityRegistryRecordById,
  removeEntityRegistryRecordById,
} from "../../registry/entityRegistry";
import { removeComponents } from "../components/remove";
import { getEntitiesByRole } from "./get";
import { resolveEntity, type EntityArgument } from "./normalize";

export const removeDataEntity = (id: Id): void => {
  const record = getEntityRegistryRecordById(id);
  if (!record) return;

  const parent = record.parent;
  if (parent !== null && record.role !== null) {
    const siblings = getEntitiesByRole(parent, record.role);
    parent.entityByRole.set(
      record.role,
      new Set(siblings.filter((e) => e.id !== id)),
    );
    parent.entityById.delete(id);
  }

  for (const componentId of record.entity.componentById.keys()) {
    removeComponents(componentId);
  }

  for (const childId of [...record.entity.entityById.keys()]) {
    removeDataEntity(childId);
  }
};

export const removeEntity = (entity: EntityArgument) => {
  const source = resolveEntity(entity);
  if (!source) {
    return;
  }
  removeDataEntity(source.id);
  removeEntityRegistryRecordById(source.id);
};

export const removeEntitiesByRole = (
  parentEntity: Entity,
  ...roles: EntityRole[]
): void => {
  for (const role of roles) {
    const entities = getEntitiesByRole(parentEntity, role);

    for (const child of entities) {
      removeEntity(child.id);
    }
  }
};

export const detachEntity = (entity: EntityArgument) => {
  const source = resolveEntity(entity);
  if (!source) return;
  const record = getEntityRegistryRecordById(source.id);

  if (!record) {
    return;
  }

  const parent = record.parent === null ? undefined : record.parent;

  if (!parent) {
    return;
  }

  const role = record.role ?? EntityRole.DEFAULT;

  parent.entityById.delete(source.id);
  parent.entityByRole.set(
    role,
    parent.entityByRole.get(role)?.difference(new Set([record.entity])) ??
      new Set(),
  );

  patchEntityRegistryRecordById(source.id, (r) => ({
    ...r,
    parent: null,
    role: null,
  }));
};
