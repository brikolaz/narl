import type { ActionResolverMap } from "../actions/types";
import { resolveInternalInitAction } from "../init/resolveInternalInitAction";
import { resolveInternalLogAction } from "../log/resolveInternalLogAction";
import { InternalActionType, type InternalAction } from "./type";

export const internalActionResolvers = {
  [InternalActionType.LOG]: resolveInternalLogAction,
  [InternalActionType.INIT]: resolveInternalInitAction,
} satisfies ActionResolverMap<InternalAction>;
