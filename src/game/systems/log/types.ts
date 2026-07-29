import type { Enum, EnumType } from "../../../utils/types/Enum";
import type { GameAction } from "../actions/types";
import type { PlayerAction } from "../player/types";

export type LogEntry = {
  message: string;
  action: Pick<GameAction, "type"> | GameAction;
  turn: number;
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

export const PendingActionType = {
  Attack: "ATTACK",
} as const satisfies Enum;
export type PendingActionType = EnumType<typeof PendingActionType>;
export type PendingAction = {
  type: typeof PendingActionType;
};
