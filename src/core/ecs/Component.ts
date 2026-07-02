import { immerable } from "immer";
import { getId } from "../../utils/getId";
import type { Unique } from "./Unique";
import type { Id } from "./Id";
import { getEcsNamespace, Namespace } from "./namespaces";

export type ComponentType = symbol;

export class Component implements Unique {
  [immerable] = true;
  id: Id = "";
  readonly type: ComponentType;

  constructor(type: ComponentType) {
    this.id = getId();
    this.type = type;
  }
}

type ComponentCreator<Props extends object | undefined = undefined> =
  Props extends object
    ? {
        (props?: Partial<Props>): Component & Props & { defaults: Props };
        type: ComponentType;
      }
    : {
        (): Component;
        type: ComponentType;
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
  const componentType: ComponentType = Symbol.for(
    getEcsNamespace(Namespace.COMPONENT, type),
  );

  const creator = (props?: Partial<Props>) => {
    const component = new Component(componentType);

    return {
      ...component,
      ...(defaults ?? {}),
      ...(props ?? {}),
      defaults,
    };
  };

  creator.type = componentType;

  return creator;
}
