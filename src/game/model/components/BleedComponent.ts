import { getComponentCreator } from "../../../core/model/Component";

type BleedComponentProps = {
  min: number;
  max: number;
};
export const BleedComponent = getComponentCreator<BleedComponentProps>(
  "BLEED",
  { min: 0, max: 0 },
);
