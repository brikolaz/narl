import { Component } from "../../../../core/ecs/Component";

type InspectDescComponentProps = {
  times: number;
  text: string;
};

export const InspectDescComponent = Component<InspectDescComponentProps>(
  "INSPECT_DESC",
  { times: 0, text: "" },
);
