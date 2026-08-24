import type { Id } from "../../../../core/model/Id";
import type { GameAction } from "../types";

export type TimedAction = {
  id: Id;
  action: GameAction;
  duration: number;
  delay: number
};
