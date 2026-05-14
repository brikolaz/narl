import { MAX_VISIBLE_LOG } from "../../../utils";
import type { GameState } from "../../state/state";
import type { PendingLog } from "../actions/action";
import { increaseTurn } from "../turn/turn";
import type { LogEntry } from "./types";

const addLog = (gameState: GameState, logEntry: string): LogEntry[] => {
  return [
    ...gameState.log,
    {
      message: logEntry,
      turn: gameState.turn,
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

export const addLogMutable = (gameState: GameState, logEntry: string): void => {
  gameState.log = addLog(gameState, logEntry);
};

export const flushLogs = (
  gameState: GameState,
  logs: PendingLog[],
  consumesTurn: boolean,
): LogEntry[] => {
  const lastestTurn = gameState.turn;
  const nextTurn = consumesTurn ? increaseTurn(lastestTurn) : lastestTurn;
  const nextLogs = logs.reduce<LogEntry[]>((next, message) => {
    next.push({
      message,
      turn: nextTurn,
    });
    return next;
  }, []);
  return [...gameState.log, ...nextLogs].slice(-MAX_VISIBLE_LOG);
};
