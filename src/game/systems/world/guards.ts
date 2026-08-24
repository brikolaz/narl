import type { GameAction } from "../actions/types"
import { WorldActionType, type WorldAction } from "./types"

export const isWorldAction = (action: GameAction): action is WorldAction => {
  return Object.values(WorldActionType).includes(action.type as WorldActionType)
}