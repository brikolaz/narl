import type { Entity } from "../../../core/model/Entity"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import type { EntityArgument } from "../../../core/model/queries/entities/normalize"
import { CursedComponent } from "../../model/components/state/CursedComponent"
import type { Action } from "../actions/action"
import { WorldActionTypeEnum } from "../world/types"

export const isCursed = (entity: EntityArgument) => {
  return hasComponentsByType(entity, CursedComponent)
}

export const curse = (action: Action, item: Entity) => {
  if (!isCursed(item)) {
    action.addPendingImmediateAction({
      type: WorldActionTypeEnum.WORLD_CURSE,
      entityId: item.id,
    })
  }
}
