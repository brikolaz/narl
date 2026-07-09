import type { Component, ComponentCreator } from "../../Component";
import type { Entity } from "../../Entity";
import type { Id } from "../../Id";
import { addComponents } from "./add";
import { getComponentById, getComponentByType } from "./get";
import { removeComponentsByType } from "./remove";

export const patchComponentById = <P extends object>(
  id: Id,
  patcher: (child: Component<P>) => void,
): void => {
  const component = getComponentById(id);
  if (!component) {
    return;
  }
  patcher(component as Component<P>);
};

export const patchComponentByType = <P extends object | undefined>(
  entity: Entity,
  type: ComponentCreator<P>,
  patcher: (component: Component<P>) => void,
): void => {
  const component = getComponentByType(entity, type.type);

  if (!component) {
    return;
  }

  patcher(component as Component<P>);
};

export const replaceComponentByType = <P extends object | undefined>(
  entity: Entity,
  type: ComponentCreator<P>,
  nextComponent: Component,
): void => {
  const component = getComponentByType(entity, type.type);

  if (!component) {
    return;
  }

  removeComponentsByType(entity, component.type);
  addComponents(entity, nextComponent);
};
