import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { InternalLogAction } from "../internal/type";

export const resolveInternalLogAction = (
  state: GameState,
  gameAction: InternalLogAction,
): ActionResolution => {
  const { message } = gameAction;
  const action = new Action(gameAction);
  action.info(message);

  return action.resolve(state);
};
