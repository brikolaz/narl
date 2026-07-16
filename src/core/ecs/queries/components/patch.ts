import type { Component } from "../../Component";
import type { EntityArgument } from "../entities/normalize";
import { upsertComponents } from "./add";
import { getComponentByType } from "./get";
import {
  resolveComponent,
  resolveComponentType,
  type ComponentArgument,
  type ComponentTypeArgument,
} from "./normalize";
import { removeComponentsByType } from "./remove";

export const patchComponent = <P extends object>(
  component: ComponentArgument,
  patcher: (component: Component<P>) => void,
): void => {
  const resolvedComponent = resolveComponent(component);
  if (!resolvedComponent) {
    return;
  }
  patcher(resolvedComponent as Component<P>);
};

export const patchComponentByType = <P extends object>(
  entity: EntityArgument,
  componentType: ComponentTypeArgument<P>,
  patcher: (component: Component<P>) => void,
): void => {
  const type = resolveComponentType(componentType);
  const component = getComponentByType(entity, type);

  if (!component) {
    return;
  }

  patcher(component as Component<P>);
};

export const replaceComponentsByType = <P extends object | undefined>(
  entity: EntityArgument,
  componentType: ComponentTypeArgument<P>,
  nextComponent: Component,
): void => {
  const component = getComponentByType(entity, componentType);

  if (!component) {
    return;
  }

  removeComponentsByType(entity, component.type);
  upsertComponents(entity, nextComponent);
};
