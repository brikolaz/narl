import type { Component, ComponentType } from "../../Component";
import type { Entity } from "../../Entity";
import type { Id } from "../../Id";
import { getComponentRegistryRecordById } from "../../registry/componentRegistry";

export const getComponentById = (id: Id) => {
  return getComponentRegistryRecordById(id)?.component;
};

export const getComponentsByType = (
  entity: Entity | undefined,
  componentType: ComponentType,
): Component[] => {
  if (!entity) return [];

  return (
    entity.componentByType
      .get(componentType)
      ?.map((componentId) => entity.componentById.get(componentId))
      .filter((component): component is Component => component !== undefined) ??
    []
  );
};
