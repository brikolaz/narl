import type { Component } from "../../Component";
import type { Id } from "../../Id";
import { getComponentRegistryRecord } from "../../registry/componentRegistry";
import { resolveEntity, type EntityArgument } from "../entities/normalize";
import { resolveComponentType, type ComponentTypeArgument } from "./normalize";

export const getComponentById = (id: Id) => {
  return getComponentRegistryRecord(id)?.component;
};

export const getComponentsByType = <P extends object | undefined>(
  entity: EntityArgument,
  componentType: ComponentTypeArgument<P>,
): Component<P>[] => {
  const source = resolveEntity(entity);
  if (!source) return [];
  const type = resolveComponentType(componentType);

  return (source.componentByType.get(type)?.values().toArray() ??
    []) as Component<P>[];
};

export const getComponentsByTypes = <P extends object | undefined>(
  entity: EntityArgument,
  componentTypes: ComponentTypeArgument<P>[],
): Component[] => {
  const source = resolveEntity(entity);
  if (!source) return [];

  return componentTypes.flatMap((componentType) => {
    const type = resolveComponentType(componentType);
    return getComponentsByType(source, type);
  }) as Component[];
};

export const getComponentByType = <P extends object | undefined>(
  entity: EntityArgument,
  componentType: ComponentTypeArgument<P>,
): Component<P> | undefined => {
  const source = resolveEntity(entity);
  if (!source) return undefined;
  const type = resolveComponentType(componentType);

  return getComponentsByType(source, type)[0] as Component<P>;
};
