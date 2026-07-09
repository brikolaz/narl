import { Component, getComponentCreator } from "../../../../core/ecs/Component";
import { COLORS } from "../../../../utils/colors";

export type ColorComponentProps = {
  color: string;
};

export const ColorComponent = getComponentCreator<ColorComponentProps>(
  "COLOR",
  {
    color: COLORS.DEFAULT,
  },
);
