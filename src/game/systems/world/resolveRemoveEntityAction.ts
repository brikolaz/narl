import { produce } from "immer";
import type { GameState } from "../../state/state";
import { WorldActionEntityType, type WorldRemoveEntityAction } from "../actions/gameAction/types";
import type { ActionResolution } from "../actions/types";
import { Action } from "../actions/action";
import { getMobById, killMobById } from "../attack/mobs";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { NameComponent } from "../../model/components/NameComponent";


export const resolveRemoveEntityAction = (
  state: GameState,
  { entityId, entityType, position }: WorldRemoveEntityAction,
): ActionResolution => {
  const action = new Action();
  const nextState = produce(state, (draft) => {
    const tile = draft.world[position];

    if (entityType === WorldActionEntityType.PLAYER) {
      throw new Error("Can't remove player");
    }

    if (!entityId) {
      throw new Error("No entity id to drop item.");
    }
    const mob = getMobById(tile, entityId);
    const mobName = getComponentByType(mob, NameComponent)?.name;
    killMobById(tile, entityId);
    return action.success(`${mobName} died.`);
  });

  return action.resolve(nextState);
};
