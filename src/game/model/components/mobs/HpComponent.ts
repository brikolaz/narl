import { Component } from "../../../../core/ecs/Component";

export type HpComponentProps = {
  hp: number;
};

export class HpComponent extends Component {
  hp: number = 0;

  constructor(props: HpComponentProps) {
    super();
    Object.assign(this, props);
  }
}
