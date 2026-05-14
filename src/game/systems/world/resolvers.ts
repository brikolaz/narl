import { WorldActionType } from "../actions/gameAction/types";
import { resolveCurseItemAction } from "../curse/resolveCurseItemAction";
import { resolveDropItemAction } from "../drop/resolveDropItemAction";
import { resolveRemoveEntityAction } from "./resolveRemoveEntityAction";

type WorldActionResolver =
  | typeof resolveCurseItemAction
  | typeof resolveDropItemAction
  | typeof resolveRemoveEntityAction;

export const worldActionResolvers = {
  [WorldActionType.CURSE_ITEM]: resolveCurseItemAction,
  [WorldActionType.DROP_ITEM]: resolveDropItemAction,
  [WorldActionType.REMOVE_ENTITY]: resolveRemoveEntityAction,
} satisfies Record<WorldActionType, WorldActionResolver>;
