import type { GameState } from "../../../../state";
import { resolveWorldAction } from "../../../world/resolveWorldAction";
import { PlayerActionType, resolvePlayerAction, type PlayerAction } from "../playerAction";
import type { ActionResolution, GameAction } from "../types";
import { WorldActionType, type WorldAction } from "./types";


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
