import { upsertComponents } from "../../../core/model/queries/components/add"
import { removeComponentsByType } from "../../../core/model/queries/components/remove"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { detachEntity } from "../../../core/model/queries/entities/remove"
import { assert } from "../../../utils/assert"
import { DefMulComponent } from "../../model/components/combat/DefMulComponent"
import { PantsSlotComponent } from "../../model/components/equipment/slots/PantsSlotComponent"
import { InspectDescComponent } from "../../model/components/interaction/InspectDescComponent"
import { InspectedComponent } from "../../model/components/interaction/InspectedComponent"
import { DisabledComponent } from "../../model/components/state/DisabledComponent"
import { DickEntityFactory } from "../../model/entities/items/dick/factory"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getContainerItemAt } from "../containers/containers"
import { dropItem } from "../drop/drop"
import { getEqSlotByType } from "../eq/eq"
import { getEntityName } from "../inspect/getEntityName"
import { getPosition } from "../position/position"
import { WorldActionTypeEnum, type WorldSeverCockAction } from "../world/types"

export const resolveWorldSeverCockAction = (
  gameAction: WorldSeverCockAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { sourceId, targetId } = gameAction

  ;(() => {
    const target = getEntityById(targetId)
    if (!target) return
    const slot = assert(
      getEqSlotByType(target, PantsSlotComponent),
      "No pants slot",
    )
    const position = getPosition(target)
    const itemAtSlot = getContainerItemAt(slot, 1)
    if (itemAtSlot) {
      detachEntity(itemAtSlot)
      dropItem(itemAtSlot, position)
    }

    dropItem(DickEntityFactory.getDefault(), position)

    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_INIT_BLEED,
      sourceId,
      targetId,
    })

    upsertComponents(slot, DisabledComponent(), DefMulComponent({ defMul: 2 }))

    removeComponentsByType(slot, InspectDescComponent)
    upsertComponents(
      slot,
      InspectedComponent(),
      InspectDescComponent({
        text: "In the Pants slot, you see nothing. It stares back at you",
      }),
    )

    action.info(`${getEntityName(target)} lost dignity`)
  })()

  return action.resolve()
}
