import type { Component } from "../Component";
import type { Constructor } from "../Constructor";
import type { Entity } from "../Entity";

export const isComponentType = <T extends Component>(
  component: Component,
  componentClass: Constructor<T>,
): component is T => component instanceof componentClass;

export const areComponentTypesEqual = (...components: Component[]): boolean => {
  if (components.length <= 1) return true;
  const targetPrototype = Object.getPrototypeOf(components[0]);
  return components.every(
    (component) => Object.getPrototypeOf(component) === targetPrototype,
  );
};

// TODO: refactor usages to pass undefined entity
export const getComponentByType = <T extends Component>(
  entity: Entity | undefined,
  componentClass: Constructor<T>,
): T | undefined => {
  if (!entity) return undefined;

  return entity.components.find((component) =>
    isComponentType(component, componentClass),
  );
};

export const getComponentsByType = <T extends Component>(
  entity: Entity | undefined,
  componentClass: Constructor<T>,
): T[] => {
  if (!entity) return [];

  return entity.components.filter((component) =>
    isComponentType(component, componentClass),
  );
};

export const getComponentById = <T extends Component = Component>(
  entity: Entity,
  componentId: string,
): T | undefined =>
  entity.components.find(
    (component): component is T => component.id === componentId,
  );

export const hasComponentByType = <T extends Component>(
  entity: Entity,
  componentClass: Constructor<T>,
): boolean =>
  entity.components.some((component) =>
    isComponentType(component, componentClass),
  );

export const hasComponentById = (
  entity: Entity,
  componentId: string,
): boolean =>
  entity.components.some((component) => component.id === componentId);

export const upsertComponents = (
  entity: Entity,
  ...nextComponents: Component[]
): void => {
  for (const nextComponent of nextComponents) {
    let replaced = false;

    const nextEntityComponents = entity.components.map((component) => {
      if (replaced || !(component instanceof nextComponent.constructor)) {
        return component;
      }

      replaced = true;
      return nextComponent;
    });

    if (replaced) {
      entity.components = nextEntityComponents;
    } else {
      entity.components.push(nextComponent);
    }
  }
};

export const patchComponentByType = <T extends Component>(
  entity: Entity,
  componentClass: Constructor<T>,
  patcher: (child: T) => Component,
): void => {
  let changed = false;
  const nextComponents = entity.components.map((child) => {
    if (!isComponentType(child, componentClass)) return child;
    changed = true;

    return patcher(child);
  });
  if (changed) entity.components = nextComponents;
};

export const addComponents = <T extends Component>(
  entity: Entity,
  ...components: T[]
): Entity => {
  entity.components.push(...components);
  return entity;
};

export const removeComponentById = (
  entity: Entity,
  componentId: string,
): void => {
  const nextComponents = entity.components.filter(
    (component) => component.id !== componentId,
  );

  entity.components = nextComponents;
};

export const removeComponentsByType = <T extends Component>(
  entity: Entity,
  componentClass: Constructor<T>,
): void => {
  const nextComponents = entity.components.filter(
    (component) => !isComponentType(component, componentClass),
  );

  entity.components = nextComponents;
};

// export const replaceComponentById = <T extends Component>(
//   entity: Entity,
//   nextComponent: T,
//   componentId?: string,
// ): Entity => {
//   let replaced = false;

//   const nextComponents = entity.components.map((component) => {
//     if (component.id !== (componentId ?? nextComponent.id)) return component;
//     replaced = true;
//     return nextComponent;
//   });

//   return replaced
//     ? {
//       ...entity,
//       components: nextComponents,
//     }
//     : entity;
// };

// export const upsertComponentById = <T extends Component>(
//   entity: Entity,
//   nextComponent: T
// ): Entity => {
//   const exists = entity.components.some(
//     (component) => component.id === nextComponent.id
//   );

//   return exists
//     ? replaceComponentById(entity, nextComponent.id, nextComponent)
//     : addComponent(entity, nextComponent);
// };

// export const patchComponentById = <T extends Component>(
//   entity: Entity,
//   componentId: string,
//   patcher: (component: T) => T
// ): Entity => {
//   let changed = false;

//   const nextComponents = entity.components.map((component) => {
//     if (component.id !== componentId) return component;
//     changed = true;
//     return patcher(component as T);
//   });

//   return changed
//     ? {
//       ...entity,
//       components: nextComponents,
//     }
//     : entity;
// };

// export const patchComponentByType = <T extends Component>(
//   entity: Entity,
//   componentClass: Constructor<T>,
//   patcher: (component: T) => T
// ): Entity => {
//   let changed = false;

//   const nextComponents = entity.components.map((component) => {
//     if (!(component instanceof componentClass) || changed) return component;
//     changed = true;
//     return patcher(component);
//   });

//   return changed
//     ? {
//       ...entity,
//       components: nextComponents,
//     }
//     : entity;
// };
