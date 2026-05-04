import { Component } from "../../../core/ecs/Component";

export type NameComponentProps = {
  name: string;
};

export class NameComponent extends Component {
  name = "";
  constructor(props: NameComponentProps) {
    super();
    Object.assign(this, props);
  }
}
