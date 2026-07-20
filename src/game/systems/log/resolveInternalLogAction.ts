import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { InternalLogAction } from "../internal/type";

export const resolveInternalLogAction = (
  gameAction: InternalLogAction,
): ActionResolution => {
  const { message } = gameAction;
  const action = new Action(gameAction);
  action.info(message);

  return action.resolve();
};
