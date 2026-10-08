import type { Entity } from "../../../../core/model/Entity"
import { upsertComponents } from "../../../../core/model/queries/components/add"
import { hasComponentsByType } from "../../../../core/model/queries/components/has"
import { removeComponentsByType } from "../../../../core/model/queries/components/remove"
import { BleedingEffectComponent } from "../../../model/components/combat/BleedingEffectComponent"
import { RemovableComponent } from "../../../model/components/equipment/RemovableComponent"
import { PantsSlotComponent } from "../../../model/components/equipment/slots/PantsSlotComponent"
import { SeveringCurseComponent } from "../../../model/components/curse/SeveringCurseComponent"
import type { Action } from "../../actions/action"
import { WorldActionTypeEnum } from "../../world/types"
import { curse, isCursed } from "../curse"

const shouldApplySeverCockCurse = (slot: Entity, item: Entity) =>
  hasComponentsByType(slot, PantsSlotComponent) &&
  hasComponentsByType(item, SeveringCurseComponent)

// TODO: make generic (sever limb)
export const applySeverCockCurse = (
  action: Action,
  target: Entity,
  slot: Entity,
  item: Entity,
) => {
  if (isCursed(item) || !shouldApplySeverCockCurse(slot, item)) return
  curse(action, item)
  upsertComponents(
    item,
    BleedingEffectComponent({ chance: 100, min: 4, max: 5, duration: 3 }),
  )
  removeComponentsByType(item, RemovableComponent)
  action.addPendingDelayedAction(
    {
      type: WorldActionTypeEnum.WORLD_SEVER_COCK,
      sourceId: item.id,
      targetId: target.id,
    },
    3,
  )
  action.addPendingDelayedAction(
    {
      type: WorldActionTypeEnum.WORLD_DISABLE,
      entityId: slot.id,
    },
    3,
  )
}
