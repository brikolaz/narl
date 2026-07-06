import { Component } from "../../../../core/ecs/Component";

export type NameComponentProps = {
  name: string;
};

export const NameComponent = Component<NameComponentProps>("NAME", {
  name: "???",
});
