import {
  PlayerActionTypeEnum,
  type PlayerWaitAction,
} from "../../../systems/player/types"
import type { KeyboardToActionCommand } from "../chain"

export const getWaitCommand = (): KeyboardToActionCommand => {
  const action: PlayerWaitAction = {
    type: PlayerActionTypeEnum.PLAYER_WAIT,
  }

  return { action }
}
