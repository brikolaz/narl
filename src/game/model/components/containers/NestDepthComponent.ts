import { Component } from "../../../../core/ecs/Component";

export type NestDepthComponentProps = {
  nestDepth: number;
};

export class NestDepthComponent extends Component {
  static DEFAULT_NEST_DEPTH = 0 as const;
  nestDepth: number = NestDepthComponent.DEFAULT_NEST_DEPTH;

  constructor(props: NestDepthComponentProps) {
    super();
    Object.assign(this, props);
  }
}
