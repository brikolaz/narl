import { Component } from "../../../../core/ecs/Component";

type InspectedComponentProps = {
  times: number;
};

export const InspectedComponent = Component<InspectedComponentProps>(
  "INSPECTED",
  { times: 0 },
);
