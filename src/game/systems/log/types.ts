import type { GameAction } from "../actions/types";

export type LogEntry = {
  message: string;
  action: Pick<GameAction, "type"> | GameAction;
  turn: number;
};

export type PendingLog = {
  message: string;
  action: GameAction;
};

export enum PendingActionType {
  Attack,
}
export type PendingAction = {
  type: PendingActionType;
};
