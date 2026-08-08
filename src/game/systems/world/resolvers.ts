import type { ActionResolution } from "../actions/types";
import { resolveWorldAttackAction } from "../attack/resolveWorldAttackAction";
import { resolveCurseAction } from "../curse/resolveCurseAction";
import { resolveDisableAction } from "../disable/resolveDisableAction";
import { resolveWorldDropItemAction } from "../drop/resolveWorldDropItemAction";
import { resolveGainExpAction } from "../exp/resolveGainExpAction";
import { resolveKillEntityAction } from "./resolveKillEntityAction";
import { resolveRemoveEntityAction } from "./resolveRemoveEntityAction";
import { resolveWorldBleedAction } from "../bleed/resolveWorldBleedAction";
import { resolveWorldInitBleedAction } from "../bleed/resolveWorldInitBleedAction";
import { resolveWorldCleanupBleedAction } from "../bleed/resolveWorldCleanupBleedAction";
import { resolveWorldMoveAction } from "../movement/resolveWorldMoveAction";
import { resolveWorldMobAiAction } from "../mobAi/resolveWorldMobAiAction";
import { WorldActionType } from "./types";

export type AnyWorldResolver = (action: any) => ActionResolution;

export const worldActionResolvers = {
  [WorldActionType.DROP_ITEM]: resolveWorldDropItemAction,
  [WorldActionType.GAIN_EXP]: resolveGainExpAction,
  [WorldActionType.KILL]: resolveKillEntityAction,
  [WorldActionType.REMOVE_ENTITY]: resolveRemoveEntityAction,
  [WorldActionType.ATTACK]: resolveWorldAttackAction,
  [WorldActionType.CURSE]: resolveCurseAction,
  [WorldActionType.DISABLE]: resolveDisableAction,
  [WorldActionType.BLEED]: resolveWorldBleedAction,
  [WorldActionType.INIT_BLEED]: resolveWorldInitBleedAction,
  [WorldActionType.CLEANUP_BLEED]: resolveWorldCleanupBleedAction,
  [WorldActionType.MOVE]: resolveWorldMoveAction,
  [WorldActionType.MOB_AI]: resolveWorldMobAiAction,
} satisfies Record<WorldActionType, AnyWorldResolver>;
