import type { Entity } from "../../../../../core/model/Entity"
import { removeComponentsByType } from "../../../../../core/model/queries/components/remove"
import { WorldActionTypeEnum } from "../../../../systems/world/types"
import { RemovableComponent } from "../../../components/equipment/RemovableComponent"
import { PantsSlotComponent } from "../../../components/equipment/slots/PantsSlotComponent"
import type { Manual } from "../../../Manual"
import { getContainerItemAt } from "../../../../systems/containers/containers"
import { getEqSlotByType } from "../../../../systems/eq/eq"
import { getPlayer } from "../../../../systems/player/player"

export const RingEntityManual: Manual = {
  shouldBeCursed(item: Entity): boolean {
    const pantsSlot = getEqSlotByType(getPlayer(), PantsSlotComponent)
    return getContainerItemAt(pantsSlot, 1)?.id === item.id
  },

  curse(gameAction, item) {
    removeComponentsByType(item, RemovableComponent.type)
    const pantsSlot = getEqSlotByType(getPlayer(), PantsSlotComponent)
    gameAction.addPendingDelayedAction(
      {
        type: WorldActionTypeEnum.WORLD_DISABLE,
        entityId: pantsSlot.id,
      },
      3,
    )
  },
}
