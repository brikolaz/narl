import { produce } from "immer";
import { getTile } from "../../model/queries/tile";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { removeMobById } from "../attack/mobs";
import type { WorldRemoveEntityAction } from "./types";

// TODO: handle other entity types
export const resolveRemoveEntityAction = (
  state: GameState,
  gameAction: WorldRemoveEntityAction,
): ActionResolution => {
  const action: Action = new Action(gameAction);
  const { entityId, position } = gameAction;
  const nextState = produce(state, (draft) => {
    const tile = getTile(draft, position);
    removeMobById(tile, entityId);
  });

  return action.resolve(nextState);
};
