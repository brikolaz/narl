import { produce } from "immer";
import {
  getEntityById
} from "../../../core/ecs/queries/entities";
import { getPlayerEntity } from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEqSlotAt } from "../eq/eq";
import {
  clearContainerItemById,
  getBackpack,
  getContainerItemById
} from "../inv/containers";
import { getItemName } from "../inv/items";
import {
  PlayerDropItemActionReason,
  type PlayerDropItemAction,
} from "../player/types";
import { getTile } from "../world/getTile";

export const resolvePlayerDropItemAction = (
  state: GameState,
  gameAction: PlayerDropItemAction,
): ActionResolution => {
  const { eqSlot, itemId, targetPosition, reason } = gameAction;
  const action = new Action(gameAction);
  console.log(getPlayerEntity(state), eqSlot, itemId);
  const nextState = produce(state, (draft) => {
    const player = getPlayerEntity(draft);
    if (!itemId) {
      throw new Error("Can't drop item without itemId");
    }
    const source = eqSlot ? getEqSlotAt(player, eqSlot) : getBackpack(player);
    if (!source) {
      throw new Error("Can't drop item without source");
    }
    const itemToDrop = eqSlot
      ? getEntityById(source, itemId)
      : getContainerItemById(source, itemId);

    if (!itemToDrop) {
      throw new Error("Can't drop item. Item not found");
    }

    const tile = getTile(draft, targetPosition);
    tile.items.push(itemToDrop);

    clearContainerItemById(source, itemToDrop.id);
    if (reason === PlayerDropItemActionReason.MANUAL) {
      
      return action.success(`Dropped ${getItemName(itemToDrop)}`);
    }

    return action.success(
      `Backpack is full. Dropped ${getItemName(itemToDrop)} to the ground`,
    );
  });

  return action.resolve(nextState);
};
