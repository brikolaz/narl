import { getPlayerEntity } from "../../model/queries/player";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { getEqSlot } from "../../model/queries/eq";
import { clearContainerItemById } from "../inv/containers";
import {
  getBackpack,
  getContainerItemAt,
} from "../../model/queries/containers";
import {
  PlayerDropItemActionReason,
  type PlayerDropItemAction,
} from "../player/types";
import { getTile } from "../../model/queries/tile";
import { getEntityName } from "../inspect/getEntityName";
import type { Entity } from "../../../core/ecs/Entity";

// TODO: drop directly from EQ
export const resolvePlayerDropItemAction = (
  state: GameState,
  gameAction: PlayerDropItemAction,
): ActionResolution => {
  const { eqSlot, invSlot, targetPosition, reason } = gameAction;
  const action: Action = new Action(gameAction);
  (() => {
    const player = getPlayerEntity(state);
    const backpack = action.assert(
      getBackpack(player),
      "Player has no backpack",
    );
    const source = action.assert(
      eqSlot ? getEqSlot(player, eqSlot) : invSlot ? backpack : undefined,
      "No source to drop item",
    );
    let itemToDrop: Entity | undefined = undefined;

    if (eqSlot !== undefined) {
      itemToDrop = action.assert(
        getContainerItemAt(source, eqSlot),
        "No item in EQ slot to drop",
      );
    } else if (invSlot !== undefined) {
      itemToDrop = getContainerItemAt(source, invSlot);
      if (!itemToDrop) {
        return action.fail(`No item to drop at slot ${invSlot}`);
      }
    }
    action.assertCondition(itemToDrop, "No item to drop");
    const tile = getTile(state, targetPosition);
    tile.items.push(itemToDrop);

    clearContainerItemById(source, itemToDrop.id);
    if (reason === PlayerDropItemActionReason.MANUAL) {
      return action.success(`Dropped ${getEntityName(itemToDrop)}`);
    }

    return action.success(
      `Backpack is full. Dropped ${getEntityName(itemToDrop)} to the ground`,
    );
  })();

  return action.resolve(state);
};
