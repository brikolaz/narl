import { getPlayer } from "../../model/queries/player";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import {
  type PlayerWaitAction
} from "../player/types";
import { getRng } from "../rng/rng";
import { WorldActionType } from "../world/types";
import { isInCombat } from "./combat";

export const resolvePlayerWaitAction = (
  gameAction: PlayerWaitAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    const player = getPlayer();
    const inCombat = isInCombat();

    if (inCombat) {
      return action.addPendingImmediateAction({
        type: WorldActionType.INIT_BLOCK,
        entityId: player.id,
      });
    }
      const rng = getRng(player);
      action.addPendingImmediateAction({
        type: WorldActionType.HEAL,
        entityId: player.id,
        value: rng.range(4, 5),
      });
      action.success(`${getEntityName(player)} wait`);
    
  })();

  return action.resolve(true);
};
