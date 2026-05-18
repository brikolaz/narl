import type { GameState } from "../../state/state";
import type { ActionResolution } from "../actions/types";
import type { InternalInitAction, InternalLogAction } from "../internal/type";

export const resolveInternalInitAction = (
  state: GameState,
  gameAction: InternalInitAction,
): ActionResolution => {
  throw new Error("INIT action should be resolved in game loop");
};
