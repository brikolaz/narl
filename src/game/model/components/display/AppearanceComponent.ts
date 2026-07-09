import { Component, getComponentCreator } from "../../../../core/ecs/Component";

export type AppearanceComponentProps = {
  background: string;
};

export const AppearanceComponent =
  getComponentCreator<AppearanceComponentProps>("APPEARANCE", {
    background: "#000000" as const,
  });
