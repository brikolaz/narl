import { MAX_VISIBLE_LOG } from "../../../utils/constants";
import type { GameState } from "../../state/state";

export const addLog = (
  gameState: GameState,
  logEntry: string,
  consumesTurn: boolean,
): GameState => {
  const nextLog = [
    ...gameState.log,
    {
      message: logEntry,
      turn: gameState.turn + Number(consumesTurn),
    },
  ];

  return {
    ...gameState,
    log: nextLog.slice(-MAX_VISIBLE_LOG),
  };
};
