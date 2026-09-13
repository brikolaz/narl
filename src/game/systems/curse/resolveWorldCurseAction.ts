import { upsertComponents } from "../../../core/model/queries/components/add"
import { patchComponentByType } from "../../../core/model/queries/components/patch"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { assert } from "../../../utils/assert"
import { COLORS } from "../../../utils/colors"
import { ColorComponent } from "../../model/components/display/ColorComponent"
import { CursedComponent } from "../../model/components/state/CursedComponent"
import { getManual } from "../../model/entities/getManual"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getEntityName } from "../inspect/getEntityName"
import type { WorldCurseAction } from "../world/types"

export const resolveWorldCurseAction = (
  gameAction: WorldCurseAction,
): ActionResolution => {
  const { entityId } = gameAction
  const action = new Action(gameAction)

  ;(() => {
    const entity = assert(getEntityById(entityId), "No entity to curse")
    const name = getEntityName(entity)
    const manual = getManual(entity)
    if (!manual) {
      return
    }
    manual?.curse?.(action, entity)
    const curseComponents = [CursedComponent()]

    upsertComponents(entity, ...curseComponents)
    patchComponentByType(entity, ColorComponent, (component) => {
      component.color = COLORS.cursed
    })
    action.info(`${name} got cursed`)
  })()

  return action.resolve()
}
