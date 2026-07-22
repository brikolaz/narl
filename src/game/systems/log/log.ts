import { MAX_VISIBLE_LOGS } from "../../../utils/constants";
import { STATE, type GameState } from "../../state/state";
import type { GameAction } from "../actions/types";
import { InternalActionType } from "../internal/type";
import { type PlayerAction } from "../player/types";
import { increaseTurn } from "../turn/turn";
import type { LogEntry, PendingLog } from "./types";

const addLog = (
  action: GameAction,
  message: string,
): LogEntry[] => {
  return [
    ...STATE.log,
    {
      message,
      action,
      turn: STATE.turn,
    },
  ].slice(-MAX_VISIBLE_LOGS);
};

export const addLogMutable = (
  action: GameAction,
  message: string,
): void => {
  STATE.log = addLog(action, message);
};

export const flushLogs = (
  logs: PendingLog[],
  consumesTurn: boolean,
): GameState => {
  const lastestTurn = STATE.turn;
  const nextTurn = consumesTurn ? increaseTurn(lastestTurn) : lastestTurn;
  const nextLogs = logs.reduce<LogEntry[]>((next, log) => {
    next.push({
      ...log,
      turn: nextTurn,
    });
    return next;
  }, []);
  STATE.log = [...STATE.log, ...nextLogs].slice(-MAX_VISIBLE_LOGS);
  return STATE;
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

export const recordPlayerAction = (
  action: PlayerAction,
): GameState => {
  STATE.actionLog = [
    ...STATE.actionLog,
    {
      action,
      timestamp: Date.now(),
    },
  ];
  return STATE;
};
