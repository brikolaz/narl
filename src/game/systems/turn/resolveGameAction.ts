import type { GameState } from "../../state";
import { resolvePlayerAction } from "./resolvePlayerAction";
import { resolveWorldAction } from "../world/resolveWorldAction";
import {
  PlayerActionType,
  WorldActionType,
  type ActionResolution,
  type GameAction,
} from "./types";

export const resolveGameAction = (
  state: GameState,
  action: GameAction,
): ActionResolution => {
  switch (action.type) {
    case PlayerActionType.ATTACK:
    case PlayerActionType.EQUIP_ITEM:
    case PlayerActionType.MOVE:
    case PlayerActionType.PICK_UP:
    case PlayerActionType.UNEQUIP_ITEM: 
      return resolvePlayerAction(state, action);

    case WorldActionType.DROP_ITEM:
    case WorldActionType.REMOVE_ENTITY:
      return resolveWorldAction(state, action);
    default:
      return {
        nextState: state,
        consumesTurn: false,
        pendingActions: [],
      };
  }
};
