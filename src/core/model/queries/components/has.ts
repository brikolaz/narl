import { resolveEntity, type EntityArgument } from "../entities/normalize"
import {
  resolveComponent,
  resolveComponentType,
  type ComponentArgument,
  type ComponentTypeArgument,
} from "./normalize"

export const hasEqualComponentTypes = (
  ...components: ComponentTypeArgument<object | undefined>[]
): boolean => {
  if (components.length === 0) {
    return true
  }
  return components.every(
    (component) =>
      resolveComponentType(component) === resolveComponentType(components[0]),
  )
}

export const isComponentType = <Props extends object | undefined>(
  component: ComponentTypeArgument<object | undefined>,
  expected: ComponentTypeArgument<Props>,
): component is ComponentTypeArgument<Props> =>
  resolveComponentType(component) === resolveComponentType(expected)

export const hasComponentsByType = <Props extends object | undefined>(
  entity: EntityArgument,
  componentType: ComponentTypeArgument<Props>,
): boolean => {
  const source = resolveEntity(entity)
  if (!source) return false
  const type = resolveComponentType(componentType)
  return (source?.componentByType?.get(type)?.size ?? 0) > 0
}

export const hasComponent = <Props extends object | undefined>(
  entity: EntityArgument,
  component: ComponentArgument<Props>,
): boolean => {
  const source = resolveEntity(entity)
  if (!source) return false
  const resolvedComponent = resolveComponent(component)
  if (!resolvedComponent) return false

  return source?.componentById?.has(resolvedComponent.id) ?? false
}
