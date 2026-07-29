import { getComponentCreator } from "../../../core/model/Component";

type PositionComponentProps = {
  position: number;
};

export const PositionComponent = getComponentCreator<PositionComponentProps>(
  "POSITION",
  { position: -1 },
);
