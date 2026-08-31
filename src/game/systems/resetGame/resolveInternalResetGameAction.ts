import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { InternalActionType, type InternalResetGameAction } from "../internal/type";
import { GAME_STATUS, initState, STATE } from "../../state/state";

export const resolveInternalResetGameAction = (
  gameAction: InternalResetGameAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    if (
      STATE.status !== GAME_STATUS.GAME_OVER &&
      STATE.status !== GAME_STATUS.WIN
    ) {
      throw new Error("Can't reset an active game");
    }

    initState();
    action.addPendingImmediateAction({ type: InternalActionType.INIT });
  })();

  return action.resolve();
};
