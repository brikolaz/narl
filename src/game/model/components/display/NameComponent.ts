import { Component } from "../../../../core/ecs/Component";

export type NameComponentProps = {
  name: string;
};

export class NameComponent extends Component {
  static DEFAULT_NAME = "???";
  name = NameComponent.DEFAULT_NAME;

  constructor(props: NameComponentProps) {
    super();
    Object.assign(this, props);
  }
}
