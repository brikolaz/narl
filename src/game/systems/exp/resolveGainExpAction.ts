import { getPlayer } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { WorldGainExpAction } from "../world/types";
import { addExp } from "./exp";

// TODO: add targetEntityId
export const resolveGainExpAction = (
  gameAction: WorldGainExpAction,
): ActionResolution => {
  const action = new Action(gameAction);
  const { exp } = gameAction;

  (() => {
    const target = getPlayer();

    addExp(target, exp);
    action.info(`Gained ${exp} EXP`);
  })();

  return action.resolve();
};
