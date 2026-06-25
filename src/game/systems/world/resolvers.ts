import type { GameState } from "../../state/state";
import type { ActionResolution } from "../actions/types";
import { resolveWorldAttackAction } from "../attack/resolveWorldAttackAction";
import { resolveCurseItemAction } from "../curse/resolveWorldCurseItemAction";
import { resolveWorldDropItemAction } from "../drop/resolveWorldDropItemAction";
import { resolveRemoveEntityAction } from "./resolveRemoveEntityAction";
import { WorldActionType } from "./types";

type AnyWorldResolver = (state: GameState, action: any) => ActionResolution;

export const worldActionResolvers = {
  [WorldActionType.CURSE_ITEM]: resolveCurseItemAction,
  [WorldActionType.DROP_ITEM]: resolveWorldDropItemAction,
  [WorldActionType.KILL_ENTITY]: resolveRemoveEntityAction,
  [WorldActionType.ATTACK]: resolveWorldAttackAction,
} satisfies Record<WorldActionType, AnyWorldResolver>;
