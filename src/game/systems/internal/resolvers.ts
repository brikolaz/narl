import { resolveInternalInitAction } from "../init/resolveInternalInitAction";
import { resolveInternalLogAction } from "../log/resolveInternalLogAction";
import { InternalActionType } from "./type";

type InternalActionResolver =
  | typeof resolveInternalLogAction
  | typeof resolveInternalInitAction;

export const internalActionResolvers = {
  [InternalActionType.LOG]: resolveInternalLogAction,
  [InternalActionType.INIT]: resolveInternalInitAction,
} satisfies Record<InternalActionType, InternalActionResolver>;
