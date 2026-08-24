import type { ActionResolverMap } from "../actions/types";
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
import { resolveWorldHealAction } from "../heal/resolveWorldHealAction";
import { resolveWorldGameOverAction } from "../gameOver/resolveWorldGameOverAction";
import { resolveWorldPendingGameOverAction } from "../gameOver/resolveWorldPendingGameOverAction";
import { WorldActionType, type WorldAction } from "./types";

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
  [WorldActionType.HEAL]: resolveWorldHealAction,
  [WorldActionType.GAME_OVER]: resolveWorldGameOverAction,
  [WorldActionType.PENDING_GAME_OVER]: resolveWorldPendingGameOverAction,
} satisfies ActionResolverMap<WorldAction>;
