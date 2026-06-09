import { resolveCurseItemAction } from "../curse/resolveCurseItemAction";
import { resolveMobDropItemAction } from "../drop/resolveMobDropItemAction";
import { resolveRemoveEntityAction } from "./resolveRemoveEntityAction";
import { WorldActionType } from "./types";

type WorldActionResolver =
  | typeof resolveCurseItemAction
  | typeof resolveMobDropItemAction
  | typeof resolveRemoveEntityAction;

export const worldActionResolvers = {
  [WorldActionType.CURSE_ITEM]: resolveCurseItemAction,
  [WorldActionType.DROP_ITEM]: resolveMobDropItemAction,
  [WorldActionType.REMOVE_ENTITY]: resolveRemoveEntityAction,
} satisfies Record<WorldActionType, WorldActionResolver>;
