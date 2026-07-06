import { immerable } from "immer";
import { getId } from "../../utils/getId";
import type { Id } from "./Id";
import { getEcsNamespace, Namespace } from "./namespaces";
import type { WidenProps } from "../Widen";

export type ComponentType = symbol;

export type Component<Props extends object | undefined = object> = {
  [immerable]: boolean;
  id: Id;
  type: ComponentType;
  defaults: Props;
} & Props;

type ComponentCreator<Props extends object | undefined = undefined> =
  Props extends object
    ? {
        (props?: Partial<Props>): Component<Props>;
        type: ComponentType;
      }
    : {
        (): Component;
        type: ComponentType;
      };

export function Component(type: string): ComponentCreator;

export function Component<Props extends object>(
  type: string,
  defaults: Props,
): ComponentCreator<WidenProps<Props>>;

export function Component<Props extends object>(
  type: string,
  defaults?: Props,
) {
  const componentType: ComponentType = Symbol.for(
    getEcsNamespace(Namespace.COMPONENT, type),
  );

  const creator = (props?: Partial<WidenProps<Props>>) => ({
    [immerable]: true,
    id: getId(),
    type: componentType,
    defaults: defaults ?? ({} as Props),
    ...(defaults ?? {}),
    ...(props ?? {}),
  });

  creator.type = componentType;

  return creator;
}
