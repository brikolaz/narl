import { getComponentCreator } from "../../../core/model/Component";

type BleedComponentProps = {
  value: number;
};
export const BleedComponent = getComponentCreator<BleedComponentProps>(
  "BLEED",
  { value: 0 },
);
