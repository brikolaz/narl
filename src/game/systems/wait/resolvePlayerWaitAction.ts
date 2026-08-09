import { getPlayer } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import type { PlayerWaitAction } from "../player/types";

export const resolvePlayerWaitAction = (
  gameAction: PlayerWaitAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    action.success(`${getEntityName(getPlayer())} wait`);
  })();

  return action.resolve();
};
