import type { GameAction } from "../actions/types"
import { PlayerActionType, type PlayerAction } from "./types"

export const isPlayerAction = (action: GameAction): action is PlayerAction => {
  return Object.values(PlayerActionType).includes(action.type as PlayerActionType)
}

