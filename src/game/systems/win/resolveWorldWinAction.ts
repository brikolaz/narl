import { GAME_STATUS, STATE } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { WorldWinAction } from "../world/types";

export const isWin = () => STATE.status === GAME_STATUS.WIN;

export const resolveWorldWinAction = (
  gameAction: WorldWinAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    STATE.status = GAME_STATUS.WIN;
  })();

  return action.resolve();
};
