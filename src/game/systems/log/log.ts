import { MAX_VISIBLE_LOG } from "../../../utils";
import type { GameState } from "../../state/state";
import type { GameAction } from "../actions/types";
import { InternalActionType } from "../internal/type";
import { increaseTurn } from "../turn/turn";
import type { LogEntry, PendingLog } from "./types";

const addLog = (
  gameState: GameState,
  action: GameAction,
  message: string,
): LogEntry[] => {
  return [
    ...gameState.log,
    {
      message,
      action,
      turn: gameState.turn,
    },
  ].slice(-MAX_VISIBLE_LOG);
};

export const addLogImmutable = (
  gameState: GameState,
  action: GameAction,
  message: string,
): GameState => {
  return {
    ...gameState,
    log: addLog(gameState, action, message),
  };
};

export const addLogMutable = (
  gameState: GameState,
  action: GameAction,
  message: string,
): void => {
  gameState.log = addLog(gameState, action, message);
};

export const flushLogs = (
  gameState: GameState,
  logs: PendingLog[],
  consumesTurn: boolean,
): GameState => {
  const lastestTurn = gameState.turn;
  const nextTurn = consumesTurn ? increaseTurn(lastestTurn) : lastestTurn;
  const nextLogs = logs.reduce<LogEntry[]>((next, log) => {
    next.push({
      ...log,
      turn: nextTurn,
    });
    return next;
  }, []);
  return {
    ...gameState,
    log: [...gameState.log, ...nextLogs].slice(-MAX_VISIBLE_LOG),
  };
};

export const getPendingLogs = (action: GameAction, messages: string[]) => {
  return messages.reduce<PendingLog[]>((pendingLogs, message) => {
    pendingLogs.push({
      message,
      action,
    });
    return pendingLogs;
  }, []);
};

export const getInternalLogAction = (message: string): GameAction => ({
  type: InternalActionType.LOG,
  message,
});
