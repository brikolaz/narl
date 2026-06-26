import { Component } from "../../../../core/ecs/Component";

export type ExpComponentProps = {
  exp: number;
};

export class ExpComponent extends Component {
  static DEFAULT_EXP = 0 as const;
  exp = ExpComponent.DEFAULT_EXP;

  constructor(props?: ExpComponentProps) {
    super();
    Object.assign(this, {
      exp: props?.exp ?? this.exp,
    });
  }
}
