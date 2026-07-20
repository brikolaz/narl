import type { GameAction } from "../../actions/types";
import { scheduleMobActions } from "./scheduleMobActions";

export const runWorldTurn = (): GameAction[] => {
  const queue: GameAction[] = [...scheduleMobActions()];

  return queue;
};
