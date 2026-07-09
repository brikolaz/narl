import { getComponentCreator } from "../../../../core/ecs/Component";

export type DefComponentProps = {
  def: number;
};

export const DefComponent = getComponentCreator<DefComponentProps>("DEF", { def: 0 });
