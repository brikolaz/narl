import { inspectItem } from "./inspectItem"
import { assert } from "../../../core/utils/assert"
import { getBackpack, getContainerItemAt } from "../containers/containers"
import { getPlayer } from "../player/player"
import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { PlayerInspectInvAction } from "../player/types"

export const resolvePlayerInspectInvAction = (
  gameAction: PlayerInspectInvAction,
): ActionResolution => {
  const { invSlot } = gameAction
  const action: Action = new Action(gameAction)

  ;(() => {
    const backpack = assert(getBackpack(getPlayer()), "Player has no backpack")

    const item = getContainerItemAt(backpack, invSlot)

    if (!item) {
      return action.info("INSPECT.NO_ITEM")
    }
    inspectItem(action, item)
  })()

  return action.resolve(false)
}
