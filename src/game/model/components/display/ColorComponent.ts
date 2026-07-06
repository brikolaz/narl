import { Component } from "../../../../core/ecs/Component";
import { COLORS } from "../../../../utils/colors";

export type ColorComponentProps = {
  color: string;
};

export const ColorComponent = Component<ColorComponentProps>(
  "COLOR",
  {
    color: COLORS.DEFAULT,
  },
);
