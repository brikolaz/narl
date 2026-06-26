import { Component } from "../../../../core/ecs/Component";

export class InspectedComponent extends Component {
  static DEFAULT_TIMES = 0 as const;
  times: number = InspectedComponent.DEFAULT_TIMES;

  constructor() {
    super();
  }
}
