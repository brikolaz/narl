import { produce } from "immer";
import type { GameState } from "../../state/state";
import { WorldActionEntityType, type ActionResolution } from "../turn";

import { getComponentByType } from "../../../core/ecs";
import { NameComponent } from "../../model/components/AppearanceComponent copy";
import { getMobById, killMobById } from "../combat";
import { Action } from "../log";

export const resolveRemoveEntityAction = (
  state: GameState,
  entityId: string | undefined,
  entityType: WorldActionEntityType,
  position: number,
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
    return action.fulfill(`${mobName} died.`);
  });

  return action.resolve(nextState, false);
};
