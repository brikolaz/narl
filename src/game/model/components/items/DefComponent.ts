import { Component } from "../../../../core/ecs/Component";

export type DefComponentProps = {
  def: number;
};

export const DefComponent = Component<DefComponentProps>("DEF", { def: 0 });
