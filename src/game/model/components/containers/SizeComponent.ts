import { getComponentCreator } from "../../../../core/model/Component";

export type SizeComponentProps = {
  size: number;
};

export const SizeComponent = getComponentCreator<SizeComponentProps>("SIZE", { size: 0 });
