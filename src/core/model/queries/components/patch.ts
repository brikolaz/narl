import type { Component } from "../../Component"
import type { EntityArgument } from "../entities/normalize"
import { upsertComponents } from "./add"
import { getComponentByType } from "./get"
import {
  resolveComponent,
  resolveComponentType,
  type ComponentArgument,
  type ComponentTypeArgument,
} from "./normalize"
import { removeComponentsByType } from "./remove"

export const patchComponent = <Props extends object>(
  component: ComponentArgument<Props>,
  patcher: (component: Component<Props>) => void,
): void => {
  const resolvedComponent = resolveComponent(component)
  if (!resolvedComponent) {
    return
  }
  patcher(resolvedComponent)
}

export const patchComponentByType = <Props extends object>(
  entity: EntityArgument,
  componentType: ComponentTypeArgument<Props>,
  patcher: (component: Component<Props>) => void,
): void => {
  const type = resolveComponentType(componentType)
  const component = getComponentByType(entity, type)

  if (!component) {
    return
  }

  patcher(component as Component<Props>)
}

export const replaceComponentsByType = <Props extends object | undefined>(
  entity: EntityArgument,
  componentType: ComponentTypeArgument<Props>,
  nextComponent: Component,
): void => {
  const component = getComponentByType(entity, componentType)

  if (!component) {
    return
  }

  removeComponentsByType(entity, component.type)
  upsertComponents(entity, nextComponent)
}
