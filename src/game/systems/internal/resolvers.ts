import type { ActionResolverMap } from "../actions/types"
import { resolveInternalInitAction } from "../init/resolveInternalInitAction"
import { resolveInternalLogAction } from "../log/resolveInternalLogAction"
import { resolveInternalResetGameAction } from "../resetGame/resolveInternalResetGameAction"
import { InternalActionTypeEnum, type InternalAction } from "./types"

export const INTERNAL_ACTION_RESOLVERS = {
  [InternalActionTypeEnum.INTERNAL_LOG]: resolveInternalLogAction,
  [InternalActionTypeEnum.INTERNAL_INIT]: resolveInternalInitAction,
  [InternalActionTypeEnum.INTERNAL_RESET_GAME]: resolveInternalResetGameAction,
} satisfies ActionResolverMap<InternalAction>
