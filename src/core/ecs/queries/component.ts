import type { Component } from "../Component";
import type { Constructor } from "../Constructor";
import type { Entity } from "../Entity";

export const getComponentByType = <T extends Component>(
  entity: Entity,
  componentClass: Constructor<T>
): T | undefined =>
  entity.components.find((component): component is T => component instanceof componentClass);

export const getComponentsByType = <T extends Component>(
  entity: Entity,
  componentClass: Constructor<T>
): T[] =>
  entity.components.filter((component): component is T => component instanceof componentClass);

export const getComponentById = <T extends Component = Component>(
  entity: Entity,
  componentId: string
): T | undefined =>
  entity.components.find((component): component is T => component.id === componentId);

export const hasComponentByType = <T extends Component>(
  entity: Entity,
  componentClass: Constructor<T>
): boolean =>
  entity.components.some((component) => component instanceof componentClass);

export const hasComponentById = (
  entity: Entity,
  componentId: string
): boolean =>
  entity.components.some((component) => component.id === componentId);

export const addComponent = <T extends Component>(
  entity: Entity,
  component: T
): Entity => ({
  ...entity,
  components: [...entity.components, component],
});

export const removeComponentById = (
  entity: Entity,
  componentId: string
): Entity => {
  const nextComponents = entity.components.filter(
    (component) => component.id !== componentId
  );

  return nextComponents.length === entity.components.length
    ? entity
    : {
      ...entity,
      components: nextComponents,
    };
};

export const removeComponentsByType = <T extends Component>(
  entity: Entity,
  componentClass: Constructor<T>
): Entity => {
  const nextComponents = entity.components.filter(
    (component) => !(component instanceof componentClass)
  );

  return nextComponents.length === entity.components.length
    ? entity
    : {
      ...entity,
      components: nextComponents,
    };
};

export const replaceComponentById = <T extends Component>(
  entity: Entity,
  nextComponent: T,
  componentId?: string,
): Entity => {
  let replaced = false;

  const nextComponents = entity.components.map((component) => {
    if (component.id !== (componentId ?? nextComponent.id)) return component;
    replaced = true;
    return nextComponent;
  });

  return replaced
    ? {
      ...entity,
      components: nextComponents,
    }
    : entity;
};

export const upsertComponentById = <T extends Component>(
  entity: Entity,
  nextComponent: T
): Entity => {
  const exists = entity.components.some(
    (component) => component.id === nextComponent.id
  );

  return exists
    ? replaceComponentById(entity, nextComponent.id, nextComponent)
    : addComponent(entity, nextComponent);
};

export const upsertComponentByType = <T extends Component>(
  entity: Entity,
  componentClass: Constructor<T>,
  nextComponent: T
): Entity => {
  let replaced = false;

  const nextComponents = entity.components.map((component) => {
    if (replaced || !(component instanceof componentClass)) return component;
    replaced = true;
    return nextComponent;
  });

  return replaced
    ? {
      ...entity,
      components: nextComponents,
    }
    : {
      ...entity,
      components: [...entity.components, nextComponent],
    };
};

export const patchComponentById = <T extends Component>(
  entity: Entity,
  componentId: string,
  patcher: (component: T) => T
): Entity => {
  let changed = false;

  const nextComponents = entity.components.map((component) => {
    if (component.id !== componentId) return component;
    changed = true;
    return patcher(component as T);
  });

  return changed
    ? {
      ...entity,
      components: nextComponents,
    }
    : entity;
};

export const patchComponentByType = <T extends Component>(
  entity: Entity,
  componentClass: Constructor<T>,
  patcher: (component: T) => T
): Entity => {
  let changed = false;

  const nextComponents = entity.components.map((component) => {
    if (!(component instanceof componentClass) || changed) return component;
    changed = true;
    return patcher(component);
  });

  return changed
    ? {
      ...entity,
      components: nextComponents,
    }
    : entity;
};

