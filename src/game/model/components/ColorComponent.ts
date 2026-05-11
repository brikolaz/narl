import { Component } from "../../../core/ecs/Component";
import { COLORS } from "../../../utils/colors";

export type ColorComponentProps = {
  color: string;
};

export class ColorComponent extends Component {
  color: string = COLORS.DEFAULT;

  constructor(props?: ColorComponentProps) {
    super();
    Object.assign(this, {
      color: props?.color ?? this.color,
    });
  }
}
