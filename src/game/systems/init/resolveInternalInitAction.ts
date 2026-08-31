import { GAME_STATUS, STATE } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { type InternalInitAction } from "../internal/type";
import { initGame } from "./initGame";

export const resolveInternalInitAction = (
  gameAction: InternalInitAction,
): ActionResolution => {
  const action = new Action(gameAction);

  if (STATE.status !== GAME_STATUS.INACTIVE) {
    throw new Error("Can't reinitialize the game");
  }

  (() => {
    initGame();
    action.info("You'd rather stay dead");
  })();

  return action.resolve();
};
