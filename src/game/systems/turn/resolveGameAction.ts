import type { GameState } from "../../state";
import { resolvePlayerAction } from "./resolvePlayerAction";
import { resolveWorldAction } from "../world/resolveWorldAction";
import {
  PlayerActionType,
  WorldActionType,
  type ActionResolution,
  type GameAction,
  type PlayerAction,
  type WorldAction,
} from "./types";

export const resolveGameAction = (
  state: GameState,
  action: GameAction,
): ActionResolution => {
  if (
    Object.values(PlayerActionType).includes(action.type as PlayerActionType)
  ) {
    return resolvePlayerAction(state, action as PlayerAction);
  }

  if (Object.values(WorldActionType).includes(action.type as WorldActionType)) {
    return resolveWorldAction(state, action as WorldAction);
  }

  return {
    nextState: state,
    consumesTurn: false,
    pendingActions: [],
  };
};
