import type { GameAction } from "../actions/types";
import type { PlayerAction } from "../player/types";

export type LogEntry = {
  message: string;
  action: Pick<GameAction, "type"> | GameAction;
  startTurn: number;
  endTurn: number;
  count: number;
};

export type PendingLog = {
  message: string;
  action: GameAction;
};

export type ActionLog = {
  turn: number;
  action: PlayerAction;
  timestamp: number;
};

