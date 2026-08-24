import { resolveEntity, type EntityArgument } from "../entities/normalize";
import {
  resolveComponent,
  resolveComponentType,
  type ComponentArgument,
  type ComponentTypeArgument,
} from "./normalize";

export const areComponentTypesEqual = (
  ...components: ComponentTypeArgument<object | undefined>[]
): boolean => {
  if (components.length === 0) {
    return true;
  }
  return components.every(
    (component) =>
      resolveComponentType(component) === resolveComponentType(components[0]),
  );
};

export const isComponentType = <T extends object | undefined>(
  component: ComponentTypeArgument<object | undefined>,
  expected: ComponentTypeArgument<T>,
): component is ComponentTypeArgument<T> =>
  resolveComponentType(component) === resolveComponentType(expected);

export const hasComponentsByType = <P extends object | undefined>(
  entity: EntityArgument,
  componentType: ComponentTypeArgument<P>,
): boolean => {
  const source = resolveEntity(entity);
  if (!source) return false;
  const type = resolveComponentType(componentType);
  return (source?.componentByType?.get(type)?.size ?? 0) > 0;
};

export const hasComponent = <P extends object | undefined>(
  entity: EntityArgument,
  component: ComponentArgument<P>,
): boolean => {
  const source = resolveEntity(entity);
  if (!source) return false;
  const resolvedComponent = resolveComponent(component);
  if (!resolvedComponent) return false;

  return source?.componentById?.has(resolvedComponent.id) ?? false;
};
