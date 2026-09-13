import type {
  Component,
  ComponentCreator,
  ComponentType,
} from "../../Component"
import type { Id } from "../../Id"
import { getComponentById } from "./get"

export type ComponentArgument<Props extends object | undefined = undefined> =
  Component<Props> | Id

export type ComponentTypeArgument<
  Props extends object | undefined = undefined,
> = ComponentCreator<Props> | Component<Props> | ComponentType

export const resolveComponentType = <
  Props extends object | undefined = undefined,
>(
  componentType: ComponentTypeArgument<Props>,
): ComponentType => {
  return typeof componentType === "symbol" ? componentType : componentType.type
}

export const resolveComponent = <Props extends object | undefined = undefined>(
  component: ComponentArgument<Props>,
): Component<Props> | undefined => {
  return typeof component === "number"
    ? (getComponentById(component) as Component<Props> | undefined)
    : component
}
