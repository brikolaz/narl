import type {
  Component,
  ComponentCreator,
  ComponentType,
} from "../../Component";
import type { Entity } from "../../Entity";
import type { Id } from "../../Id";
import { getComponentRegistryRecord } from "../../registry/componentRegistry";

// TODO: add common utils for resolving type/entity
export const getComponentById = (id: Id) => {
  return getComponentRegistryRecord(id)?.component;
};

export const getComponentsByType = <P extends object>(
  entity: Entity | undefined,
  componentType: ComponentCreator<P> | Component<P> | ComponentType,
): Component<P>[] => {
  if (!entity) return [];
  const type =
    typeof componentType === "symbol" ? componentType : componentType.type;
  
  return (entity.componentByType.get(type)?.values().toArray() ??
    []) as Component<P>[];
};

export const getComponentsByTypes = (
  entity: Entity | undefined,
  componentTypes: (ComponentCreator | Component | ComponentType)[],
): Component[] => {
  if (!entity) return [];

  return componentTypes.flatMap((componentType) => {
    const type =
      typeof componentType === "symbol" ? componentType : componentType.type;
    return getComponentsByType(entity, type);
  });
};

export const getComponentByType = <P extends object>(
  entity: Entity | undefined,
  componentType: ComponentCreator<P> | Component<P> | ComponentType,
): Component<P> | undefined => {
  const type =
    typeof componentType === "symbol" ? componentType : componentType.type;

  return getComponentsByType(entity, type)[0] as Component<P>;
};
