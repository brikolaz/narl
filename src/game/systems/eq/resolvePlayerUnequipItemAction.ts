import { getEntityName } from "../inspect/getEntityName"
import {
  addItemToEntityBackpack,
  clearContainerItemAt,
  getBackpack,
  getContainerItemAt,
  isContainerFull,
} from "../containers/containers"
import { assert } from "../../../utils/assert"
import { getEqSlotByPosition, isRemovable } from "./eq"
import { getPlayer } from "../player/player"
import { getPosition } from "../position/position"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import {
  PlayerActionTypeEnum,
  PlayerDropItemActionReasonEnum,
  type PlayerUnequipItemAction,
} from "../player/types"

export const resolvePlayerUnequipItemAction = (
  gameAction: PlayerUnequipItemAction,
): ActionResolution => {
  const { eqSlot: eqSlotIndex } = gameAction

  const action: Action = new Action(gameAction)
  ;(() => {
    const player = getPlayer()
    const backpack = assert(getBackpack(player), "Player has no backpack")
    const isFull = isContainerFull(backpack)

    const slot = assert(getEqSlotByPosition(player, eqSlotIndex), "No EQ slot")
    const item = getContainerItemAt(slot, 1)
    if (!item) {
      return action.fail("ITEM.EMPTY_SLOT", getEntityName(slot))
    }

    if (!isRemovable(item)) {
      return action.fail("ITEM.NOT_REMOVABLE")
    }

    if (isFull) {
      return action.addPendingImmediateAction({
        type: PlayerActionTypeEnum.PLAYER_DROP_ITEM,
        targetPosition: getPosition(player),
        eqSlot: eqSlotIndex,
        invSlot: undefined,
        reason: PlayerDropItemActionReasonEnum.BACKPACK_FULL,
      })
    }

    addItemToEntityBackpack(player, item)
    clearContainerItemAt(slot, 1)
    action.success("ITEM.UNEQUIPPED", getEntityName(item))
  })()

  return action.resolve()
}
