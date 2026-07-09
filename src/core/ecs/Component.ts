import { immerable } from "immer";
import { getId } from "../../utils/getId";
import type { Id } from "./Id";
import { getEcsNamespace, Namespace } from "./namespaces";

export type ComponentType = symbol;

export type Component<Props extends object | undefined = object> = {
  [immerable]: boolean;
  id: Id;
  type: ComponentType;
  defaults: Props;
} & Props;

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
        defaults: undefined
      };

export function getComponentCreator(type: string): ComponentCreator;

export function getComponentCreator<Props extends object>(
  type: string,
  defaults: Props,
): ComponentCreator<Props>;

export function getComponentCreator<Props extends Component>(
  type: string,
  defaults?: Props,
) {
  const componentType: ComponentType = Symbol(
    getEcsNamespace(Namespace.COMPONENT, type),
  );

  const creator = (props?: Partial<Props>) => ({
    [immerable]: true,
    id: getId(),
    type: componentType,
    defaults: defaults ?? ({} as Props),
    ...(defaults ?? {}),
    ...(props ?? {}),
  });

  creator.type = componentType;
  creator.defaults = defaults;

  return creator;
}

// TODO: REFACTOR USAGES
