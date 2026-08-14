import { getPlayer } from "../../model/queries/player";
import { GAME_STATUS, STATE } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import type { WorldPendingGameOverAction } from "../world/types";
import { getEpitaph } from "./epitaphs";

export const resolveWorldPendingGameOverAction = (
  gameAction: WorldPendingGameOverAction,
): ActionResolution => {
  const action = new Action(gameAction);

  (() => {
    if (STATE.status !== GAME_STATUS.ACTIVE) {
      return action.resolve();
    }

    action.info(`${getEntityName(getPlayer())} died`);
    STATE.status = GAME_STATUS.PENDING_GAME_OVER;

    STATE.death.epitaph = getEpitaph();
  })();

  return action.resolve();
};
