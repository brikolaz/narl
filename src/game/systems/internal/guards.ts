import type { GameAction } from "../actions/types"
import { InternalActionType, type InternalAction } from "./type"

export const isInternalAction = (action: GameAction): action is InternalAction => {
  return Object.values(InternalActionType).includes(action.type as InternalActionType)
}