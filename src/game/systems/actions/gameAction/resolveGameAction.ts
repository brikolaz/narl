import { isInternalAction } from "../../internal/guards";
import { resolveInternalAction } from "../../internal/resolveInternalAction";
import { isPlayerAction } from "../../player/guards";
import { resolvePlayerAction } from "../../player/resolvePlayerAction";
import { isWorldAction } from "../../world/guards";
import { resolveWorldAction } from "../../world/resolveWorldAction";
import type { ActionResolution, GameAction } from "../types";

export const resolveGameAction = (
  action: GameAction,
): ActionResolution => {
  if (isPlayerAction(action)) {
    return resolvePlayerAction(action);
  }

  if (isWorldAction(action)) {
    return resolveWorldAction(action);
  }

  if (isInternalAction(action)) {
    return resolveInternalAction(action);
  }

  throw new Error("Invalid game action");
};
