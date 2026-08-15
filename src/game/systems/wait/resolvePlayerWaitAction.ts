import { getPlayer } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import {
  type PlayerWaitAction
} from "../player/types";
import { getRng } from "../rng/rng";
import { WorldActionType } from "../world/types";

export const resolvePlayerWaitAction = (
  gameAction: PlayerWaitAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const player = getPlayer();
    const rng = getRng(player);

    action.addPendingImmediateAction({
      type: WorldActionType.HEAL,
      entityId: player.id,
      value: rng.range(4, 5),
    });

    action.success(`${getEntityName(getPlayer())} wait`);
  })();

  return action.resolve(true);
};
