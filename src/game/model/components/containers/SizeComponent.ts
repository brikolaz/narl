import { Component } from "../../../../core/ecs/Component";

export type SizeComponentProps = {
  size: number;
};

export const SizeComponent = Component<SizeComponentProps>("SIZE", { size: 0 });
