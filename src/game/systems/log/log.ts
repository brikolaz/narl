import { MAX_VISIBLE_LOG } from "../../../utils";
import type { GameState } from "../../state/state";
import type { LogEntry } from "./types";

const addLog = (
  gameState: GameState,
  logEntry: string,
): LogEntry[] => {
  return [
    ...gameState.log,
    {
      message: logEntry,
      turn: gameState.turn
    },
  ].slice(-MAX_VISIBLE_LOG);
};

export const addLogImmutable = (
  gameState: GameState,
  logEntry: string,
): GameState => {
  return {
    ...gameState,
    log: addLog(gameState, logEntry),
  };
};

export const addLogMutable = (
  gameState: GameState,
  logEntry: string,
): void => {
  gameState.log = addLog(gameState, logEntry);
};
