import { getEntityLogProjection } from "../log/getEntityLogProjection"
import { assert } from "../../../utils/assert"
import { getBackpack, getContainerItemAt } from "../containers/containers"
import { getPlayer } from "../player/player"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import { triggerOnInspectCurse } from "../curse/triggers/triggerOnInspectCurse"
import type { PlayerInspectInvAction } from "../player/types"
import { increaseInspected } from "./inspect"

export const resolvePlayerInspectInvAction = (
  gameAction: PlayerInspectInvAction,
): ActionResolution => {
  const { invSlot } = gameAction
  const action: Action = new Action(gameAction)

  ;(() => {
    const player = getPlayer()
    const backpack = assert(getBackpack(player), "Player has no backpack")

    const item = getContainerItemAt(backpack, invSlot)

    if (!item) {
      return action.info("INSPECT.NO_ITEM")
    }
    increaseInspected(item)

    action.info("INSPECT.ITEM", getEntityLogProjection(item))
    triggerOnInspectCurse(action, item)
  })()

  return action.resolve(false)
}
