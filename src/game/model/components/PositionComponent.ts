import { getComponentCreator } from "../../../core/ecs/Component";

type PositionComponentProps = {
  position: number;
};

export const PositionComponent = getComponentCreator<PositionComponentProps>(
  "POSITION",
  { position: 0 },
);
