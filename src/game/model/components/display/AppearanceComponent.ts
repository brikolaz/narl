import { Component } from "../../../../core/ecs/Component";

export type AppearanceComponentProps = {
  background: string;
};

export const AppearanceComponent =
  Component<AppearanceComponentProps>("APPEARANCE", {
    background: "#000000" as const,
  });
