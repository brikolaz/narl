import type { Component, ComponentType } from "../Component";
import type { Entity } from "../Entity";

export const areComponentTypesEqual = (...components: Component[]): boolean => {
  if (components.length === 0) {
    return true;
  }
  return components.every((component) => component.type === components[0].type);
};

export const getComponentByType = (
  entity: Entity | undefined,
  componentType: ComponentType,
): Component | undefined => {
  if (!entity) {
    return undefined;
  }

  return entity.components.get(componentType)?.[0];
};

export const getComponentsByType = (
  entity: Entity | undefined,
  componentType: ComponentType,
): Component[] => {
  if (!entity) return [];

  return entity.components.get(componentType) ?? [];
};

export const hasComponentByType = (
  entity: Entity | undefined,
  componentType: ComponentType,
): boolean => {
  if (!entity) return false;

  return (entity.components.get(componentType)?.length ?? 0) > 0;
};

export const replaceComponents = (
  entity: Entity | undefined,
  ...nextComponents: Component[]
): void => {
  if (!entity) return;

  for (const nextComponent of nextComponents) {
    entity.components.set(nextComponent.type, []);
  }
  for (const nextComponent of nextComponents) {
    const components = getComponentsByType(entity, nextComponent.type);
    components.push(nextComponent);
    entity.components.set(nextComponent.type, components);
  }
};

export const patchFirstComponentByType = (
  entity: Entity | undefined,
  componentType: ComponentType,
  patcher: (child: Component) => Component,
): void => {
  if (!entity) {
    return;
  }
  const components = getComponentsByType(entity, componentType);
  if (!components[0]) {
    return;
  }
  components[0] = patcher(components[0]);
  entity.components.set(componentType, components);
};

export const addComponents = (
  entity: Entity | undefined,
  ...components: Component[]
): void => {
  if (!entity) {
    return;
  }
  for (const component of components) {
    const nextComponents = getComponentsByType(entity, component.type);
    nextComponents.push(component);
    entity.components.set(component.type, nextComponents);
  }
};

export const removeComponentsByType = (
  entity: Entity | undefined,
  ...componentTypes: ComponentType[]
): void => {
  if (!entity) {
    return;
  }
  for (const componentType of componentTypes) {
    entity.components.delete(componentType);
  }
};

// todo: use registry
// export const getComponentById = <Component>(
//   entity: Entity,
//   componentId: string,
// ): Component | undefined =>
//   entity.components.find(
//     (component): component is T => component.id === componentId,
//   );
