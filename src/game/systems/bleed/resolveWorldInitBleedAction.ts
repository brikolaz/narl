import {
  getComponentByType,
  getComponentsByType,
} from "../../../core/model/queries/components/get"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { BleedingEffectComponent } from "../../model/components/combat/BleedingEffectComponent"
import { getRng } from "../rng/rng"
import { assert } from "../../../utils/assert"
import { BleedComponent } from "../../model/components/combat/BleedComponent"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { getEntityName } from "../inspect/getEntityName"
import { WorldActionTypeEnum, type WorldInitBleedAction } from "../world/types"

export const resolveWorldInitBleedAction = (
  gameAction: WorldInitBleedAction,
): ActionResolution => {
  const { sourceId, targetId } = gameAction
  const action: Action = new Action(gameAction)

  ;(() => {
    const source = getEntityById(sourceId)
    const target = getEntityById(targetId)
    if (!source || !target) return
    const bleedingEffect = getComponentByType(source, BleedingEffectComponent)
    if (!bleedingEffect || !getRng(source).chance(bleedingEffect.chance)) return
    const { min, max, duration } = bleedingEffect
    assert(duration > 1, "Bleed must last at least 1 turn")
    const bleed = BleedComponent({ min, max })
    upsertComponents(target, bleed)

    const multiple = getComponentsByType(target, BleedComponent).length > 1
    if (multiple) {
      action.info(`${getEntityName(target)} bleed some more`)
    } else {
      action.info(`${getEntityName(target)} bleed`)
    }

    action.addPendingDelayedAction(
      {
        type: WorldActionTypeEnum.WORLD_BLEED,
        bleedId: bleed.id,
      },
      1,
      duration,
    )
    action.addPendingDelayedAction(
      {
        type: WorldActionTypeEnum.WORLD_CLEANUP_BLEED,
        bleedId: bleed.id,
      },
      duration,
      1,
    )
  })()

  return action.resolve()
}
