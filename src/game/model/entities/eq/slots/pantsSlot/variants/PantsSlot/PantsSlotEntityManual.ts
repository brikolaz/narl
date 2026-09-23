import { upsertComponents } from "../../../../../../../../core/model/queries/components/add"
import { hasComponentsByType } from "../../../../../../../../core/model/queries/components/has"
import { removeComponentsByType } from "../../../../../../../../core/model/queries/components/remove"
import { detachEntity } from "../../../../../../../../core/model/queries/entities/remove"
import { getEntityRegistryRecordById } from "../../../../../../../../core/model/registry/entityRegistry"
import { getContainerItemAt } from "../../../../../../../systems/containers/containers"
import { isCursed } from "../../../../../../../systems/curse/curse"
import { isDisabled } from "../../../../../../../systems/disable/disable"
import { dropItem } from "../../../../../../../systems/drop/drop"
import { getEntityName } from "../../../../../../../systems/inspect/getEntityName"
import { getPlayer } from "../../../../../../../systems/player/player"
import { getPosition } from "../../../../../../../systems/position/position"
import { WorldActionTypeEnum } from "../../../../../../../systems/world/types"
import { BleedComponent } from "../../../../../../components/combat/BleedComponent"
import { DefMulComponent } from "../../../../../../components/combat/DefMulComponent"
import { RingComponent } from "../../../../../../components/equipment/RingComponent"
import { SpikeComponent } from "../../../../../../components/combat/SpikeComponent"
import { InspectDescComponent } from "../../../../../../components/interaction/InspectDescComponent"
import { InspectedComponent } from "../../../../../../components/interaction/InspectedComponent"
import { DisabledComponent } from "../../../../../../components/state/DisabledComponent"
import type { Manual } from "../../../../../../Manual"
import { DickEntityFactory } from "../../../../../items/dick/factory"

export const PantsSlotEntityManual: Manual = {
  disable(action, entity) {
    if (hasComponentsByType(entity, DisabledComponent)) {
      return
    }
    const itemAtSlot = getContainerItemAt(entity, 1)
    if (
      itemAtSlot &&
      hasComponentsByType(itemAtSlot, RingComponent) &&
      isCursed(itemAtSlot)
    ) {
      detachEntity(itemAtSlot)
      const player = getPlayer()
      const playerPosition = getPosition(player)
      dropItem(DickEntityFactory.getDefault(), playerPosition)
      dropItem(itemAtSlot, playerPosition)
      const bleed = BleedComponent({ min: 4, max: 5 })
      upsertComponents(player, bleed)
      upsertComponents(entity, DefMulComponent({ defMul: 2 }))
      action.addPendingImmediateAction({
        type: WorldActionTypeEnum.WORLD_INIT_BLEED,
        bleedId: bleed.id,
        duration: 3,
      })
      const parent = getEntityRegistryRecordById(entity.id)?.parent ?? undefined
      action.info(`${getEntityName(parent)} lost dignity`)
    }
    upsertComponents(entity, DisabledComponent())
    removeComponentsByType(entity, InspectDescComponent.type)
    upsertComponents(
      entity,
      InspectedComponent(),
      InspectDescComponent({
        text: "In the Pants slot, you see nothing. It stares back at you",
      }),
    )
  },

  canAdd(pantsSlot, entity) {
    if (isDisabled(pantsSlot)) {
      if (hasComponentsByType(entity, SpikeComponent)) {
        return true
      }
      return false
    }
    return true
  },
}
