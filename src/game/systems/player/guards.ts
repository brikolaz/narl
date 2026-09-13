import type { GameAction } from "../actions/types"
import { PlayerActionTypeEnum, type PlayerAction } from "./types"

export const isPlayerAction = (action: GameAction): action is PlayerAction => {
  return Object.values(PlayerActionTypeEnum).includes(
    action.type as PlayerActionTypeEnum,
  )
}
