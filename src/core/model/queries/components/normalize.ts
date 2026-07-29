import type {
  Component,
  ComponentCreator,
  ComponentType,
} from "../../Component";
import type { Id } from "../../Id";
import { getComponentById } from "./get";

export type ComponentArgument<P extends object | undefined = undefined> =
  | Component<P>
  | Id;

export type ComponentTypeArgument<P extends object | undefined = undefined> =
  | ComponentCreator<P>
  | Component<P>
  | ComponentType;

export const resolveComponentType = <P extends object | undefined = undefined>(
  componentType: ComponentTypeArgument<P>,
): ComponentType => {
  return typeof componentType === "symbol" ? componentType : componentType.type;
};

export const resolveComponent = <P extends object | undefined = undefined>(
  component: ComponentArgument<P>,
): Component<P> => {
  return typeof component === "number"
    ? (getComponentById(component) as Component<P>)
    : component;
};
