import type { Effect } from "../effects/effects";
import type { InternalAction } from "../internal/type";
import type { PendingLog } from "../log/types";
import type { PlayerAction, PlayerActionType } from "../player/types";
import type { WorldAction, WorldActionType } from "../world/types";
import type { Action } from "./action";

export type GameActionType = PlayerActionType | WorldActionType;

export type GameAction = PlayerAction | WorldAction | InternalAction;

export type ActionResolution = {
  consumesTurn: boolean;
  pendingLogs: PendingLog[];
  pendingActions: GameAction[];
  pendingEffects: Effect[];
  action?: Action;
};
