import { getComponentCreator } from "../../../core/model/Component";

export type PierceComponentProps = {
  pierce: number;
};

export const PierceComponent = getComponentCreator<PierceComponentProps>(
  "PIERCE",
  { pierce: 1 },
);
