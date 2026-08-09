import { getHp } from "../../model/queries/hp";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { WorldHealAction } from "../world/types";

export const resolveWorldHealAction = (
  gameAction: WorldHealAction,
): ActionResolution => {
  const { entityId, value } = gameAction;
  const action = new Action(gameAction);

  (() => {
    const hpComponent = getHp(entityId);
    hpComponent.hp = Math.min(hpComponent.hp + value, hpComponent.maxHp);
  })();

  return action.resolve();
};
