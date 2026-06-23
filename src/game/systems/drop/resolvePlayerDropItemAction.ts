import { produce } from "immer";
import type { ItemEntity } from "../../model/entities/items/ItemEntity";
import { getPlayerEntity } from "../../state/selectors/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEqSlotAt } from "../eq/eq";
import {
  clearContainerItemById,
  getBackpack,
  getContainerItemAt,
} from "../inv/containers";
import { getItemName } from "../inv/items";
import {
  PlayerDropItemActionReason,
  type PlayerDropItemAction,
} from "../player/types";
import { getTile } from "../world/getTile";

// TODO: drop directly from EQ
export const resolvePlayerDropItemAction = (
  state: GameState,
  gameAction: PlayerDropItemAction,
): ActionResolution => {
  const { eqSlot, invSlot, targetPosition, reason } = gameAction;
  const action: Action = new Action(gameAction);
  const nextState = produce(state, (draft) => {
    const player = getPlayerEntity(draft);
    const backpack = action.assert(
      getBackpack(player),
      "Player has no backpack",
    );
    const source = action.assert(
      eqSlot ? getEqSlotAt(player, eqSlot) : invSlot ? backpack : undefined,
      "No source to drop item",
    );
    let itemToDrop: ItemEntity | undefined = undefined;

    if (eqSlot !== undefined) {
      itemToDrop = getContainerItemAt(source, eqSlot);
      if (!itemToDrop) {
        throw new Error("No item in EQ slot to drop");
      }
    } else if (invSlot !== undefined) {
      itemToDrop = getContainerItemAt(source, invSlot);
      if (!itemToDrop) {
        return action.fail(`No item to drop at slot ${invSlot}`);
      }
    }
    action.assertCondition(itemToDrop, "No item to drop");
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
