import { produce } from "immer";
import type { GameState } from "../../state/state";
import { WorldActionEntityType, type WorldRemoveEntityAction } from "./types";
import type { ActionResolution } from "../actions/types";
import { Action } from "../actions/action";
import { getMobById } from "../../model/queries/mobs";
import { killMobById } from "../attack/mobs";
import { getTile } from "../../model/queries/tile";
import { getEntityName } from "../inspect/getEntityName";

export const resolveRemoveEntityAction = (
  state: GameState,
  gameAction: WorldRemoveEntityAction,
): ActionResolution => {
  const action: Action = new Action(gameAction);
  const { entityId, entityType, position } = gameAction;
  const nextState = produce(state, (draft) => {
    const tile = getTile(draft, position);
    action.assertCondition(
      entityType !== WorldActionEntityType.PLAYER,
      "Can't remove player",
    );
    action.assertCondition(entityId, "No entity id to drop item");
    const mob = getMobById(tile, entityId);
    const mobName = getEntityName(mob);
    killMobById(tile, entityId);
    return action.success(`${mobName} died`);
  });

  return action.resolve(nextState);
};
