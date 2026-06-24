import { Component } from "../../../../core/ecs/Component";

export type ExpComponentProps = {
  exp: number;
};

export class ExpComponent extends Component {
  exp = 0;

  constructor(props?: ExpComponentProps) {
    super();
    Object.assign(this, {
      exp: props?.exp ?? this.exp,
    });
  }
}
