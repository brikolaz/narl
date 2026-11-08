import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { getEntityName } from "../inspect/getEntityName"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { WorldEnrageAction } from "../world/types"
import { patchComponentByType } from "../../../core/model/queries/components/patch"
import {
  HostilityComponent,
  HostilityEnum,
} from "../../model/components/ai/HostilityComponent"
import { isHostile } from "../attack/hostility"

export const resolveWorldEnrageAction = (
  gameAction: WorldEnrageAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { entityId } = gameAction
  ;(() => {
    const entity = getEntityById(entityId)
    if (!entity || isHostile(entity)) {
      return
    }

    patchComponentByType(entity, HostilityComponent, (component) => {
      component.hostility = HostilityEnum.HOSTILE
    })
    const source =
      gameAction.sourceId !== undefined
        ? getEntityById(gameAction.sourceId)
        : undefined
    if (source) {
      action.info(
        "ENTITY.ENRAGED",
        getEntityName(source),
        getEntityName(entity),
      )
    } else {
      action.info("ENTITY.HOSTILE", getEntityLogProjection(entity))
    }
  })()
  return action.resolve()
}
