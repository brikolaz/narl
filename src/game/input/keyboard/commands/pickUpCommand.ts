import {
  PlayerActionTypeEnum,
  type PlayerPickUpUnpackAction,
} from "../../../systems/player/types"
import type { KeyboardToActionCommand } from "../chain"

export const getPickUpCommand = (): KeyboardToActionCommand => {
  const action: PlayerPickUpUnpackAction = {
    type: PlayerActionTypeEnum.PLAYER_PICK_UP_UNPACK,
  }

  return {
    action,
  }
}
