import type { Component, ComponentType } from "../../Component";
import type { Entity } from "../../Entity";
import type { Id } from "../../Id";
import { getEntityById } from "../entities/get";

export const areComponentTypesEqual = (...components: Component[]): boolean => {
  if (components.length === 0) {
    return true;
  }
  return components.every((component) => component.type === components[0].type);
};

export const hasComponentsByType = (
  entity: Entity | Id | undefined,
  componentType: ComponentType,
): boolean => {
  if (entity === undefined) return false;
  const source = typeof entity === "string" ? getEntityById(entity) : entity;

  return (source?.componentByType?.get(componentType)?.length ?? 0) > 0;
};

export const hasComponentById = (
  entity: Entity | Id | undefined,
  id: Id,
): boolean => {
  if (!entity) return false;

  const source = typeof entity === "string" ? getEntityById(entity) : entity;

  return source?.componentById?.has(id) ?? false;
};
