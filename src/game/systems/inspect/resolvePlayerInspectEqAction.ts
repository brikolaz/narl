import { assert } from "../../../utils/assert"
import { getContainerItemAt } from "../containers/containers"
import { getEqSlotByPosition } from "../eq/eq"
import { getPlayer } from "../player/player"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { curse } from "../curse/curse"
import type { PlayerInspectEqAction } from "../player/types"
import { getEntityName } from "./getEntityName"
import {
  getInspectDesc,
  getItemInspectText,
  increaseInspected,
} from "./inspect"

export const resolvePlayerInspectEqAction = (
  gameAction: PlayerInspectEqAction,
): ActionResolution => {
  const { eqSlot } = gameAction
  const action = new Action(gameAction)

  ;(() => {
    const player = getPlayer()
    const slot = assert(getEqSlotByPosition(player, eqSlot), "No EQ slot")
    const item = getContainerItemAt(slot, 1)

    if (!item) {
      return action.info(
        getInspectDesc(slot) || `${getEntityName(slot)} slot is empty`,
      )
    }

    increaseInspected(item)
    action.info(getItemInspectText(item, slot))
    curse(action, item)
  })()

  return action.resolve(false)
}
