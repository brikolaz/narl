import type { GameState } from "../../../state";
import type { Action } from "./action";
import type { WorldAction, WorldActionType } from "./gameAction/types";
import type { PlayerAction, PlayerActionType } from "./playerAction/types";

export type ActionType = PlayerActionType | WorldActionType;

export type GameAction = PlayerAction | WorldAction;

export type ActionResolution = {
  nextState: GameState;
  consumesTurn: boolean;
  pendingActions: GameAction[];
  action?: Action;
};
