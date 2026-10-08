import { upsertComponents } from "../../../core/model/queries/components/add"
import { patchComponentByType } from "../../../core/model/queries/components/patch"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { COLORS } from "../../../utils/colors"
import { ColorComponent } from "../../model/components/display/ColorComponent"
import { CursedComponent } from "../../model/components/state/CursedComponent"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getEntityName } from "../inspect/getEntityName"
import type { WorldCurseAction } from "../world/types"
import { isCursed } from "./curse"

export const resolveWorldCurseAction = (
  gameAction: WorldCurseAction,
): ActionResolution => {
  const { entityId } = gameAction
  const action = new Action(gameAction)

  ;(() => {
    const entity = getEntityById(entityId)
    if (!entity || isCursed(entity)) return
    const name = getEntityName(entity)
    upsertComponents(entity, CursedComponent())
    patchComponentByType(entity, ColorComponent, (component) => {
      component.color = COLORS.cursed
    })
    action.info(`${name} got cursed`)
  })()

  return action.resolve()
}
