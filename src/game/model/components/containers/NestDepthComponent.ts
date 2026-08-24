import { getComponentCreator } from "../../../../core/model/Component";

export type NestDepthComponentProps = {
  nestDepth: number;
};

export const NestDepthComponent = getComponentCreator<NestDepthComponentProps>(
  "NEST_DEPTH",
  { nestDepth: 0 },
);
