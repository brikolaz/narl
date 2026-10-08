import type { Entity } from "../../../../core/model/Entity"
import { getComponentByType } from "../../../../core/model/queries/components/get"
import { AssableCurseComponent } from "../../../model/components/curse/AssableCurseComponent"
import type { Action } from "../../actions/action"
import { getInspectedTimes } from "../../inspect/inspect"
import { WorldActionTypeEnum } from "../../world/types"
import { curse, isCursed } from "../curse"

const shouldApplyAssableCurse = (item: Entity) => {
  const assableCurse = getComponentByType(item, AssableCurseComponent)
  return (
    !!assableCurse && getInspectedTimes(item) >= assableCurse.inspectedTimes
  )
}

export const applyAssableCurse = (action: Action, item: Entity) => {
  if (isCursed(item) || !shouldApplyAssableCurse(item)) return
  curse(action, item)
  action.addPendingImmediateAction({
    type: WorldActionTypeEnum.WORLD_MAKE_PANTS,
    entityId: item.id,
  })
}
