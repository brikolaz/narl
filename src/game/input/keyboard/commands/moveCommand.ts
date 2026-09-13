import {
  PlayerActionTypeEnum,
  type PlayerMoveAction,
} from "../../../systems/player/types"
import type { DirectionEnum } from "../../../systems/turn/types"
import type { KeyboardToActionCommand } from "../chain"

export const getMoveCommand = (
  direction: DirectionEnum,
): KeyboardToActionCommand => {
  const action: PlayerMoveAction = {
    type: PlayerActionTypeEnum.PLAYER_MOVE,
    direction,
  }

  return {
    action,
  }
}
