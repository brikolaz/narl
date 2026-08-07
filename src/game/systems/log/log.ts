import { MAX_VISIBLE_LOGS } from "../../../utils/constants";
import { STATE, type GameState } from "../../state/state";
import type { GameAction } from "../actions/types";
import { InternalActionType } from "../internal/type";
import { type PlayerAction } from "../player/types";
import { increaseTurn } from "../turn/turn";
import type { LogEntry, PendingLog } from "./types";

const stackLog = (logs: LogEntry[], entry: LogEntry): LogEntry[] => {
  const lastLog = logs.at(-1);

  if (lastLog?.message !== entry.message || lastLog.turn !== entry.turn) {
    return [...logs, entry].slice(-MAX_VISIBLE_LOGS);
  }

  return [
    ...logs.slice(0, -1),
    { ...lastLog, count: lastLog.count + entry.count },
  ];
};

const addLog = (action: GameAction, message: string): LogEntry[] => {
  return stackLog(STATE.log, {
    message,
    action,
    turn: STATE.turn,
    count: 1,
  });
};

export const log = (action: GameAction, message: string): void => {
  STATE.log = addLog(action, message);
};

export const flushLogs = (
  logs: PendingLog[],
  consumesTurn: boolean,
): GameState => {
  const lastestTurn = STATE.turn;
  const nextTurn = consumesTurn ? increaseTurn(lastestTurn) : lastestTurn;
  STATE.log = logs.reduce<LogEntry[]>(
    (next, log) =>
      stackLog(next, {
        ...log,
        turn: nextTurn,
        count: 1,
      }),
    STATE.log,
  );
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

export const getInternalLogAction = (message: string | string[]): GameAction => ({
  type: InternalActionType.LOG,
  message,
});

export const recordPlayerAction = (action: PlayerAction): GameState => {
  STATE.actionLog.push({
    turn: STATE.turn,
    action,
    timestamp: Date.now(),
  });
  return STATE;
};
