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
import { getEntityName } from "../inspect/getEntityName"

// TODO: pass hostility (enum)
export const resolveWorldEnrageAction = (
  gameAction: WorldEnrageAction,
): ActionResolution => {
  const action = new Action(gameAction)
  const { entityId } = gameAction
  ;(() => {
    const entity = getEntityById(entityId)
    if (!entity || isHostile(entity)) return

    patchComponentByType(entity, HostilityComponent, (component) => {
      component.hostility = HostilityEnum.HOSTILE
    })
    const source =
      gameAction.sourceId !== undefined
        ? getEntityById(gameAction.sourceId)
        : undefined
    action.info(
      source
        ? `${getEntityName(source)} enraged ${getEntityName(entity)}`
        : `${getEntityName(entity)} is hostile`,
    )
  })()
  return action.resolve()
}
