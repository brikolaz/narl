import { Action } from "../actions/action"
import type { ActionResolution } from "../actions/types"
import type { PlayerCraftAction } from "../player/types"
import { getBackpack, getContainerItems } from "../containers/containers"
import { getPlayer } from "../player/player"
import { getEqItems } from "../eq/eq"
import { craft } from "./craft"

export const resolvePlayerCraftAction = (
  gameAction: PlayerCraftAction,
): ActionResolution => {
  const action = new Action(gameAction)

  ;(() => {
    const player = getPlayer()
    const backpack = getBackpack(player)
    const availableItems = [
      ...(backpack ? getContainerItems(backpack) : []),
      ...getEqItems(player),
    ]
    const items = gameAction.items
      .map((id) => availableItems.find((item) => item.id === id))
      .filter((item) => item !== undefined)
    if (!items.length || items.length !== gameAction.items.length) {
      return action.fail("ITEM.INVALID_SELECTION")
    }
    if (new Set(items.map((item) => item.id)).size !== items.length) {
      return action.fail("ITEM.SAME_SELECTION")
    }

    craft(action, items)
  })()

  return action.resolve()
}
