import { Component } from "../../../../core/ecs/Component";
import { DEFAULT_DEF } from "../../../../utils";


export type DefComponentProps = {
  def: number;
};

export class DefComponent extends Component {
  def: number = DEFAULT_DEF;

  constructor(props: DefComponentProps) {
    super();
    Object.assign(this, props);
  }
}
