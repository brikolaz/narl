import { STATE } from "../../game/state/state";
import { getEcsNamespace, Namespace } from "./namespaces";
import type { Unique } from "./Unique";

export type ComponentType = symbol;

export type Component<Props extends object | undefined = object> = {
  type: ComponentType;
  defaults: Props;
} & Unique & Props;

export type ComponentCreator<Props extends object | undefined = undefined> =
  Props extends object
    ? {
        (props?: Partial<Props>): Component<Props>;
        type: ComponentType;
        defaults: Props;
      }
    : {
        (): Component;
        type: ComponentType;
        defaults: undefined;
      };

export function getComponentCreator(type: string): ComponentCreator;

export function getComponentCreator<Props extends object>(
  type: string,
  defaults: Props,
): ComponentCreator<Props>;

export function getComponentCreator<Props extends object>(
  type: string,
  defaults?: Props,
) {
  const componentType: ComponentType = Symbol(
    getEcsNamespace(Namespace.COMPONENT, type),
  );

  const creator = (props?: Partial<Props>) => {
    const component = {
      id: STATE.getId(),
      type: componentType,
      defaults: defaults ?? ({} as Props),
      ...(defaults ?? {}),
      ...(props ?? {}),
    };
    return component;
  };

  creator.type = componentType;
  creator.defaults = defaults;

  return creator;
}
