import { Component } from "../../../core/ecs/Component";

export type DefComponentProps = {
  def: number;
};

export class DefComponent extends Component {
  def: number = 0;

  constructor(props: DefComponentProps) {
    super();
    Object.assign(this, props);
  }
}
