import type { Id } from "../../../../core/ecs/Id";
import type { GameAction } from "../types";

export type TimedAction = {
  id: Id;
  immediate: boolean;
  action: GameAction;
  turns: number;
};
