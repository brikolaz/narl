import type { ComponentType } from "../../Component";
import type { Entity } from "../../Entity";
import type { Id } from "../../Id";
import {
  getComponentRegistryRecordById,
  removeComponentRegistryRecordsById,
} from "../../registry/componentRegistry";

const removeDataComponentsByType = (
  entity: Entity | undefined,
  ...componentTypes: ComponentType[]
) => {
  if (!entity) {
    return [];
  }
  const ids: Id[] = [];
  for (const componentType of componentTypes) {
    const nextIds =
      entity.componentByType.get(componentType)?.keys().toArray() ?? [];

    ids.push(...nextIds);
    for (const id of nextIds) {
      entity.componentById.delete(id);
    }
    entity.componentByType.delete(componentType);
  }
  return ids;
};

// TODO: component/entity types should be of Component | ComponentCreator / Entity | EntityCreator,
// .type should be accessed inside
export const removeComponentsByType = (
  entity: Entity | undefined,
  ...componentTypes: ComponentType[]
) => {
  const ids = removeDataComponentsByType(entity, ...componentTypes);
  removeComponentRegistryRecordsById(...ids);
};

const removeDataComponentById = (id: Id): void => {
  const record = getComponentRegistryRecordById(id);
  const parent = record.parent;
  const type = record.component.type;
  if (!record) return;
  if (!parent) {
    throw new Error("No parent entity in registry");
  }

  parent.componentByType.get(type)?.delete(id);
};

const removeDataComponentsById = (...ids: Id[]): void => {
  for (const id of ids) {
    removeDataComponentById(id);
  }
};

export const removeComponentById = (...ids: Id[]): void => {
  removeDataComponentsById(...ids);
  removeComponentRegistryRecordsById(...ids);
};
