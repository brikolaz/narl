import { produce } from "immer";
import type { GameState } from "../../state/state";
import { WorldActionEntityType, type WorldRemoveEntityAction } from "./types";
import type { ActionResolution } from "../actions/types";
import { Action } from "../actions/action";
import { getMobById, killMobById } from "../attack/mobs";
import { getComponentByType } from "../../../core/ecs/queries/component";
import { NameComponent } from "../../model/components/display/NameComponent";
import { getTile } from "./getTile";

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
    const mobName = getComponentByType(mob, NameComponent)?.name;
    killMobById(tile, entityId);
    return action.success(`${mobName} died`);
  });

  return action.resolve(nextState);
};
