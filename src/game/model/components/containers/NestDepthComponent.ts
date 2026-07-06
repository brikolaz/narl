import { Component } from "../../../../core/ecs/Component";

export type NestDepthComponentProps = {
  nestDepth: number;
};

export const NestDepthComponent = Component<NestDepthComponentProps>(
  "NEST_DEPTH",
  { nestDepth: 0 },
);
