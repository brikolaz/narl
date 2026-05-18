import type { GameState } from "../../../state/state";
import { resolveInternalAction } from "../../internal/resolveInternalAction";
import { InternalActionType, type InternalAction } from "../../internal/type";
import { resolvePlayerAction } from "../../player/resolvePlayerAction";
import { PlayerActionType, type PlayerAction } from "../../player/types";
import { resolveWorldAction } from "../../world/resolveWorldAction";
import { WorldActionType, type WorldAction } from "../../world/types";
import type { ActionResolution, GameAction } from "../types";

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

  if (
    Object.values(InternalActionType).includes(
      action.type as InternalActionType,
    )
  ) {
    return resolveInternalAction(state, action as InternalAction);
  }

  throw new Error("Invalid game action");
};
