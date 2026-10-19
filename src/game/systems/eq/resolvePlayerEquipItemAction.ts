import { getEntityName } from "../inspect/getEntityName"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { PantsSlotComponent } from "../../model/components/equipment/slots/PantsSlotComponent"
import { SpikeComponent } from "../../model/components/combat/SpikeComponent"
import type { Entity } from "../../../core/model/Entity"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { assert } from "../../../utils/assert"
import { MainHandComponent } from "../../model/components/equipment/MainHandComponent"
import { OffhandSlotComponent } from "../../model/components/equipment/slots/OffhandSlotComponent"
import {
  addItemsToContainer,
  getBackpack,
  getContainerItemAt,
  getFirstContainerItem,
} from "../containers/containers"
import { isDisabled } from "../disable/disable"
import { getEq, getEqSlotByType, getItemSlots, isTwoHand } from "./eq"
import { getPlayer } from "../player/player"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { PlayerEquipItemAction } from "../player/types"
import { triggerOnEquipCurse } from "../curse/triggers/triggerOnEquipCurse"

const getCompatiblePrimaryEqSlot = (
  player: Entity,
  item: Entity,
): Entity | undefined => {
  const itemSlots = getItemSlots(item)

  assert(itemSlots.length === 1 || isTwoHand(item), "Invalid item slots")

  const itemSlot =
    itemSlots.length === 1
      ? itemSlots[0]
      : getComponentByType(item, MainHandComponent)

  if (!itemSlot) {
    return undefined
  }

  return getEq(player).find((slot) =>
    getItemSlots(slot).some((eqItemSlot) => eqItemSlot.type === itemSlot.type),
  )
}

export const resolvePlayerEquipItemAction = (
  gameAction: PlayerEquipItemAction,
): ActionResolution => {
  const { invSlot: invSlotIndex } = gameAction
  const action = new Action(gameAction)
  ;(() => {
    const player = getPlayer()
    const backpack = assert(getBackpack(player), "Player has no backpack")

    const itemToEquip = getContainerItemAt(backpack, invSlotIndex)
    if (!itemToEquip) {
      return action.fail("ITEM.NOTHING_TO_EQUIP")
    }

    const eqSlot = getCompatiblePrimaryEqSlot(player, itemToEquip)
    if (!eqSlot) {
      return action.fail("ITEM.NOT_EQUIPPABLE", getEntityName(itemToEquip))
    }

    const itemInPrimarySlot = getFirstContainerItem(eqSlot)

    if (
      isDisabled(eqSlot) &&
      !(
        hasComponentsByType(eqSlot, PantsSlotComponent) &&
        hasComponentsByType(itemToEquip, SpikeComponent)
      )
    ) {
      return action.fail("EQUIPMENT.DISABLED_SLOT", getEntityName(eqSlot))
    }
    if (itemInPrimarySlot) {
      return action.fail(
        "EQUIPMENT.OCCUPIED_SLOT",
        getEntityName(itemInPrimarySlot),
        getEntityName(eqSlot),
      )
    }

    if (isTwoHand(itemToEquip)) {
      const offhandSlot = getEqSlotByType(player, OffhandSlotComponent)
      const offhandItem = offhandSlot && getFirstContainerItem(offhandSlot)
      if (offhandItem) {
        return action.fail(
          "EQUIPMENT.OCCUPIED_SLOT",
          getEntityName(offhandItem),
          getEntityName(offhandSlot),
        )
      }
    }

    addItemsToContainer(eqSlot, itemToEquip)
    action.success("ITEM.EQUIPPED", getEntityName(itemToEquip))
    triggerOnEquipCurse(action, player, eqSlot, itemToEquip)
  })()

  return action.resolve()
}
