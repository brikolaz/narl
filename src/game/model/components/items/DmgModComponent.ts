import { Component } from "../../../../core/ecs/Component";

export type DmgModComponentProps = {
  dmgMod: number;
};

export class DmgModComponent extends Component {
  dmgMod = 0;

  constructor(props: DmgModComponentProps) {
    super();
    Object.assign(this, props);
  }
}
