import { produce } from "immer";
import { getBackpack } from "../../model/queries/containers";
import { getExp } from "../../model/queries/exp";
import { getMobById } from "../../model/queries/mobs";
import { getTile } from "../../model/queries/tile";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEntityName } from "../inspect/getEntityName";
import { WorldActionType, type WorldKillAction } from "./types";

export const resolveKillEntityAction = (
  state: GameState,
  gameAction: WorldKillAction,
): ActionResolution => {
  const action: Action = new Action(gameAction);
  const { entityId, position } = gameAction;
  const nextState = produce(state, (draft) => {
    const tile = getTile(draft, position);
    const mob = action.assert(getMobById(tile, entityId), "No mob to kill");
    const backpack = action.assert(getBackpack(mob), "Mob has no backpack");
    action.success(`${getEntityName(mob)} died`);
    const exp = getExp(mob);
    action.addPending({
      type: WorldActionType.GAIN_EXP,
      exp,
    });
    action.addPending({
      type: WorldActionType.DROP_ITEM,
      targetPosition: position,
      entityId,
      itemId: backpack.id,
    });
    action.addPending({
      type: WorldActionType.REMOVE_ENTITY,
      entityId,
      position,
    });
    return;
  });

  return action.resolve(nextState);
};
