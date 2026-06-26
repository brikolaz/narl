import { Component } from "../../../../core/ecs/Component";

export type DefComponentProps = {
  def: number;
};

export class DefComponent extends Component {
  static DEFAULT_DEF = 0 as const;
  def: number = DefComponent.DEFAULT_DEF;

  constructor(props: DefComponentProps) {
    super();
    Object.assign(this, props);
  }
}
