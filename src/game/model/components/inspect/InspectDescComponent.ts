import { Component, getComponentCreator } from "../../../../core/ecs/Component";

type InspectDescComponentProps = {
  times: number;
  text: string;
};

export const InspectDescComponent = getComponentCreator<InspectDescComponentProps>(
  "INSPECT_DESC",
  { times: 0, text: "" },
);
