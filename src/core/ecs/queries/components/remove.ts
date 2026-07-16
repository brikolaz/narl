import type { Id } from "../../Id";
import {
  getComponentRegistryRecord,
  removeComponentRegistryRecords,
} from "../../registry/componentRegistry";
import { resolveEntity, type EntityArgument } from "../entities/normalize";
import {
  resolveComponent,
  resolveComponentType,
  type ComponentArgument,
  type ComponentTypeArgument,
} from "./normalize";

const removeDataComponentsByType = (
  entity: EntityArgument,
  ...componentTypes: ComponentTypeArgument[]
) => {
  const source = resolveEntity(entity);
  if (!source) {
    return [];
  }
  const ids: Id[] = [];
  const resolvedComponentTypes = componentTypes.map((componentType) =>
    resolveComponentType(componentType),
  );
  for (const componentType of resolvedComponentTypes) {
    const nextIds =
      source.componentByType.get(componentType)?.keys().toArray() ?? [];

    ids.push(...nextIds);
    for (const id of nextIds) {
      source.componentById.delete(id);
    }
    source.componentByType.delete(componentType);
  }
  return ids;
};

export const removeComponentsByType = (
  entity: EntityArgument,
  ...componentTypes: ComponentTypeArgument[]
) => {
  const ids = removeDataComponentsByType(
    resolveEntity(entity),
    ...componentTypes.map((componentType) =>
      resolveComponentType(componentType),
    ),
  );
  removeComponentRegistryRecords(...ids);
};

const removeDataComponentById = (id: Id): void => {
  const record = getComponentRegistryRecord(id);
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

export const removeComponents = (...components: ComponentArgument[]): void => {
  const ids = components.map((component) => resolveComponent(component).id);
  removeDataComponentsById(...ids);
  removeComponentRegistryRecords(...ids);
};
