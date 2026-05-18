import type { GameState } from "../../state/state";
import type { PendingLog } from "../log/types";
import type { PlayerAction, PlayerActionType } from "../player/types";
import type { WorldAction, WorldActionType } from "../world/types";
import type { Action } from "./action";
import type { InternalAction } from "../internal/type";

export type GameActionType = PlayerActionType | WorldActionType;

export type GameAction = PlayerAction | WorldAction | InternalAction;

export type ActionResolution = {
  nextState: GameState;
  consumesTurn: boolean;
  pendingLogs: PendingLog[];
  pendingActions: GameAction[];
  action?: Action;
};
