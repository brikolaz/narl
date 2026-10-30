import { getEqSlotInspection } from "./getEqSlotInspection"
import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { assert } from "../../../utils/assert"
import { getContainerItemAt } from "../containers/containers"
import { getEqSlotByPosition } from "../eq/eq"
import { getPlayer } from "../player/player"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { triggerOnInspectCurse } from "../curse/triggers/triggerOnInspectCurse"
import type { PlayerInspectEqAction } from "../player/types"
import { increaseInspected } from "./inspect"

export const resolvePlayerInspectEqAction = (
  gameAction: PlayerInspectEqAction,
): ActionResolution => {
  const { eqSlot } = gameAction
  const action = new Action(gameAction)

  ;(() => {
    const player = getPlayer()
    const slot = assert(getEqSlotByPosition(player, eqSlot), "No EQ slot")
    const item = getContainerItemAt(slot, 1)
    action.info("INSPECT.EQ_SLOT", getEqSlotInspection(slot))

    if (!item) {
      return action.info("INSPECT.EMPTY_SLOT", getEntityLogProjection(slot))
    }

    increaseInspected(item)
    action.info("INSPECT.ITEM", getEntityLogProjection(item))
    triggerOnInspectCurse(action, item)
  })()

  return action.resolve(false)
}
