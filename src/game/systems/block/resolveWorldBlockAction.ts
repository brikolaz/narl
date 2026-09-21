import { upsertComponents } from "../../../core/model/queries/components/add"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { getEntityById } from "../../../core/model/queries/entities/get"
import { assert } from "../../../utils/assert"
import { BlockComponent } from "../../model/components/BlockComponent"
import { DefComponent } from "../../model/components/combat/DefComponent"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { WorldActionTypeEnum, type WorldBlockAction } from "../world/types"

export const resolveWorldBlockAction = (
  gameAction: WorldBlockAction,
): ActionResolution => {
  const action = new Action(gameAction)

  ;(() => {
    const entity = assert(
      getEntityById(gameAction.entityId),
      "No entity to block",
    )
    const blockDef = DefComponent({
      def:
        getComponentByType(entity, BlockComponent)?.def ??
        BlockComponent.defaults.def,
    })

    upsertComponents(entity, blockDef)
    action.success("You block.")
    action.addPendingDelayedAction({
      type: WorldActionTypeEnum.WORLD_CLEANUP_BLOCK,
      defId: blockDef.id,
    })
  })()

  return action.resolve()
}
