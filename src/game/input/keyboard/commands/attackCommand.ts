import { PlayerActionTypeEnum } from "../../../systems/player/types"
import { DirectionEnum } from "../../../systems/turn/types"
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain"

const getAttackActionCommands = (): KeyboardToAction => {
  return {
    ArrowLeft: {
      action: {
        type: PlayerActionTypeEnum.PLAYER_ATTACK,
        direction: DirectionEnum.LEFT,
      },
    },
    ArrowRight: {
      action: {
        type: PlayerActionTypeEnum.PLAYER_ATTACK,
        direction: DirectionEnum.RIGHT,
      },
    },
  }
}

export const getAttackCommand = (): KeyboardToActionCommand => ({
  action: getAttackActionCommands,
  message: "Left/right? (arrow keys)",
  fallback: "Invalid direction",
})
