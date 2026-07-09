import { Component, getComponentCreator } from "../../../../core/ecs/Component";

type InspectedComponentProps = {
  times: number;
};

export const InspectedComponent = getComponentCreator<InspectedComponentProps>(
  "INSPECTED",
  { times: 0 },
);
