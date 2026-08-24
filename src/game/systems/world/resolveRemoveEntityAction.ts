import { removeEntity } from "../../../core/model/queries/entities/remove";
import { getTile } from "../../model/queries/tile";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { removeMobById } from "../attack/mobs";
import type { WorldRemoveEntityAction } from "./types";

// TODO: handle other entity types
export const resolveRemoveEntityAction = (
  gameAction: WorldRemoveEntityAction,
): ActionResolution => {
  const action: Action = new Action(gameAction);
  const { entityId, position } = gameAction;
  (() => {
    const tile = getTile(position);
    removeMobById(tile, entityId);
    removeEntity(entityId);
  })();

  return action.resolve();
};
