import type { Entity } from "../../../../core/model/Entity"
import { getComponentByType } from "../../../../core/model/queries/components/get"
import { hasComponentsByType } from "../../../../core/model/queries/components/has"
import { OffensiveContainerCurseComponent } from "../../../model/components/curse/OffensiveContainerCurseComponent"
import type { Action } from "../../actions/action"
import { WorldActionTypeEnum } from "../../world/types"
import { curse, isCursed } from "../curse"

const shouldApplyOffensiveContainerCurse = (item: Entity) =>
  hasComponentsByType(item, OffensiveContainerCurseComponent)

export const applyOffensiveContainerCurse = (action: Action, item: Entity) => {
  if (isCursed(item) || !shouldApplyOffensiveContainerCurse(item)) return
  curse(action, item)
  const { dmgMul, minDmg, maxDmg } =
    getComponentByType(item, OffensiveContainerCurseComponent) ??
    OffensiveContainerCurseComponent.defaults
  action.addPendingImmediateAction({
    type: WorldActionTypeEnum.WORLD_UPDATE_DMG,
    entityId: item.id,
    dmgMul: dmgMul,
    min: minDmg,
    max: maxDmg,
  })
}
