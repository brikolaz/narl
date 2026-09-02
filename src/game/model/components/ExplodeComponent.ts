import { getComponentCreator } from "../../../core/model/Component";

export type ExplodeComponentProps = {
  min: number;
  max: number;
};

export const ExplodeComponent =
  getComponentCreator<ExplodeComponentProps>("EXPLODE", {
    min: 0,
    max: 0,
  });
