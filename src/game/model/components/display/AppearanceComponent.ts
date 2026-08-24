import { getComponentCreator } from "../../../../core/model/Component";

export type AppearanceComponentProps = {
  background: string;
};

export const AppearanceComponent =
  getComponentCreator<AppearanceComponentProps>("APPEARANCE", {
    background: "#000000" as const,
  });
