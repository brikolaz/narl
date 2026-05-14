import { Component } from "../../../core/ecs/Component";
import { DEFAULT_NEST_DEPTH } from "../../../utils/constants";

export type NestDepthComponentProps = {
  nestDepth: number;
};

export class NestDepthComponent extends Component {
  nestDepth: number = DEFAULT_NEST_DEPTH;

  constructor(props: NestDepthComponentProps) {
    super();
    Object.assign(this, props);
  }
}
