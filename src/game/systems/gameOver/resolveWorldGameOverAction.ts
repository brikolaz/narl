import { GAME_STATUS, STATE } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { WorldGameOverAction } from "../world/types";

export const resolveWorldGameOverAction = (
  gameAction: WorldGameOverAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    if (STATE.status !== GAME_STATUS.PENDING_GAME_OVER) {
      throw new Error("Game over has not been initialized");
    }
    STATE.status = GAME_STATUS.GAME_OVER;
  })();

  return action.resolve();
};
