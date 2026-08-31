import type { Enum, EnumType } from "../../../utils/types/Enum";

export const InternalActionType = {
  INIT: "INTERNAL_INIT",
  LOG: "INTERNAL_LOG",
  RESET_GAME: "INTERNAL_RESET_GAME",
} as const satisfies Enum;
export type InternalActionType = EnumType<typeof InternalActionType>;

export type InternalInitAction = { type: typeof InternalActionType.INIT };
export type InternalLogAction = {
  type: typeof InternalActionType.LOG;
  message: string | string[];
};
export type InternalResetGameAction = { type: typeof InternalActionType.RESET_GAME };
export type InternalAction = InternalInitAction | InternalLogAction | InternalResetGameAction;
