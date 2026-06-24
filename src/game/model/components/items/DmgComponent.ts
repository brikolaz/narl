import { Component } from "../../../../core/ecs/Component";

export type DmgComponentProps = {
  dmg: number;
};

export class DmgComponent extends Component {
  dmg: number = 0;

  constructor(props: DmgComponentProps) {
    super();
    Object.assign(this, props);
  }
}
