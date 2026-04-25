import { MAX_VISIBLE_LOG } from "../../../utils/constants";
import type { GameState } from "../../state/state";
import type { LogEntry } from "./types";

export const addLog = (gameState: GameState, logEntry: LogEntry): GameState => {
  const next = [...gameState.log, logEntry].slice(-MAX_VISIBLE_LOG);

  return {
    ...gameState,
    log: next,
  };
};