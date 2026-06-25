import type { GameState } from "../../../state/state";
import type { GameAction } from "../../actions/types";
import { scheduleMobActions } from "./scheduleMobActions";

export const runWorldTurn = (gameState: GameState): GameAction[] => {
  const queue: GameAction[] = [...scheduleMobActions(gameState)];

  return queue;
};
