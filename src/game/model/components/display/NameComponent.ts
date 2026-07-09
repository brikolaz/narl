import { Component, getComponentCreator } from "../../../../core/ecs/Component";

export type NameComponentProps = {
  name: string;
};

export const NameComponent = getComponentCreator<NameComponentProps>("NAME", {
  name: "???",
});
