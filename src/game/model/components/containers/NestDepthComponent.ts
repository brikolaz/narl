import { getComponentCreator } from "../../../../core/ecs/Component";

export type NestDepthComponentProps = {
  nestDepth: number;
};

export const NestDepthComponent = getComponentCreator<NestDepthComponentProps>(
  "NEST_DEPTH",
  { nestDepth: 0 },
);
