import type { InternalAction } from "../internal/types"
import type { PendingLog } from "../log/types"
import type { PlayerAction } from "../player/types"
import type { WorldAction } from "../world/types"
import type { Action } from "./action"
import type { TimedAction } from "./timedActions/types"

export type GameAction = PlayerAction | WorldAction | InternalAction

export type ActionResolution = {
  consumesTurn: boolean
  pendingLogs: PendingLog[]
  pendingActions: TimedAction[]
  action?: Action
}

export type ActionResolverMap<ActionType extends GameAction> = {
  [ActionDiscriminant in ActionType["type"]]: (
    action: Extract<ActionType, { type: ActionDiscriminant }>,
  ) => ActionResolution
}
