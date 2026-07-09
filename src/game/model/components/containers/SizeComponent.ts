import { getComponentCreator } from "../../../../core/ecs/Component";

export type SizeComponentProps = {
  size: number;
};

export const SizeComponent = getComponentCreator<SizeComponentProps>("SIZE", { size: 0 });
