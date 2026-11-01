import type { LogMessage } from "../log/types"
import { createEnum } from "../../../core/utils/types/Enum"

export const InternalActionTypeEnum = createEnum(
  "INTERNAL_INIT",
  "INTERNAL_LOG",
  "INTERNAL_RESET_GAME",
)

export type InternalInitAction = {
  type: typeof InternalActionTypeEnum.INTERNAL_INIT
}
export type InternalLogAction = {
  type: typeof InternalActionTypeEnum.INTERNAL_LOG
  message: LogMessage | LogMessage[]
}
export type InternalResetGameAction = {
  type: typeof InternalActionTypeEnum.INTERNAL_RESET_GAME
}
export type InternalAction =
  InternalInitAction | InternalLogAction | InternalResetGameAction
