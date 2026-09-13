import { getPlayer } from "../../../systems/player/player"
import { DirectionEnum } from "../../../systems/turn/types"
import { WorldActionTypeEnum } from "../../../systems/world/types"
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain"

const getPokeActionCommands = (): KeyboardToAction => {
  return {
    ArrowLeft: {
      action: {
        type: WorldActionTypeEnum.WORLD_POKE,
        sourceId: getPlayer().id,
        direction: DirectionEnum.LEFT,
      },
    },
    ArrowRight: {
      action: {
        type: WorldActionTypeEnum.WORLD_POKE,
        sourceId: getPlayer().id,
        direction: DirectionEnum.RIGHT,
      },
    },
  }
}

export const getPokeCommand = (): KeyboardToActionCommand => {
  return {
    action: () => getPokeActionCommands(),
    message: `Left/right? (arrow keys)`,
    fallback: "Invalid direction",
  }
}
