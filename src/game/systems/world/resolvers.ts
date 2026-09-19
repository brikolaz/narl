import type { ActionResolverMap } from "../actions/types"
import { resolveWorldAttackAction } from "../attack/resolveWorldAttackAction"
import { resolveWorldCurseAction } from "../curse/resolveWorldCurseAction"
import { resolveWorldDisableAction } from "../disable/resolveWorldDisableAction"
import { resolveWorldDropItemAction } from "../drop/resolveWorldDropItemAction"
import { resolveWorldGainExpAction } from "../exp/resolveWorldGainExpAction"
import { resolveWorldKillAction } from "./resolveWorldKillAction"
import { resolveWorldRemoveEntityAction } from "./resolveWorldRemoveEntityAction"
import { resolveWorldBleedAction } from "../bleed/resolveWorldBleedAction"
import { resolveWorldInitBleedAction } from "../bleed/resolveWorldInitBleedAction"
import { resolveWorldCleanupBleedAction } from "../bleed/resolveWorldCleanupBleedAction"
import { resolveWorldMoveAction } from "../movement/resolveWorldMoveAction"
import { resolveWorldMobAiAction } from "../mobAi/resolveWorldMobAiAction"
import { resolveWorldHealAction } from "../heal/resolveWorldHealAction"
import { resolveWorldGameOverAction } from "../gameOver/resolveWorldGameOverAction"
import { resolveWorldPendingGameOverAction } from "../gameOver/resolveWorldPendingGameOverAction"
import { resolveWorldWinAction } from "../win/resolveWorldWinAction"
import { resolveWorldExplodeAction } from "../explode/resolveWorldExplodeAction"
import { resolveWorldInitExplodeAction } from "../explode/resolveWorldInitExplodeAction"
import { resolveWorldCleanupExplodeAction } from "../explode/resolveWorldCleanupExplodeAction"
import { resolveWorldDealDamageAction } from "../dealDamage/resolveWorldDealDamageAction"
import { resolveWorldBlockAction } from "../block/resolveWorldBlockAction"
import { resolveWorldCleanupBlockAction } from "../block/resolveWorldCleanupBlockAction"
import { resolveWorldInitBlockAction } from "../block/resolveWorldInitBlockAction"
import { resolveWorldPokeAction } from "../poke/resolveWorldPokeAction"
import { resolveWorldRestAction } from "../rest/resolveWorldRestAction"
import { WorldActionTypeEnum, type WorldAction } from "./types"

export const WORLD_ACTION_RESOLVERS = {
  [WorldActionTypeEnum.WORLD_DROP_ITEM]: resolveWorldDropItemAction,
  [WorldActionTypeEnum.WORLD_GAIN_EXP]: resolveWorldGainExpAction,
  [WorldActionTypeEnum.WORLD_KILL]: resolveWorldKillAction,
  [WorldActionTypeEnum.WORLD_REMOVE_ENTITY]: resolveWorldRemoveEntityAction,
  [WorldActionTypeEnum.WORLD_ATTACK]: resolveWorldAttackAction,
  [WorldActionTypeEnum.WORLD_CURSE]: resolveWorldCurseAction,
  [WorldActionTypeEnum.WORLD_DISABLE]: resolveWorldDisableAction,
  [WorldActionTypeEnum.WORLD_BLEED]: resolveWorldBleedAction,
  [WorldActionTypeEnum.WORLD_INIT_BLEED]: resolveWorldInitBleedAction,
  [WorldActionTypeEnum.WORLD_CLEANUP_BLEED]: resolveWorldCleanupBleedAction,
  [WorldActionTypeEnum.WORLD_MOVE]: resolveWorldMoveAction,
  [WorldActionTypeEnum.WORLD_MOB_AI]: resolveWorldMobAiAction,
  [WorldActionTypeEnum.WORLD_HEAL]: resolveWorldHealAction,
  [WorldActionTypeEnum.WORLD_GAME_OVER]: resolveWorldGameOverAction,

  [WorldActionTypeEnum.WORLD_PENDING_GAME_OVER]:
    resolveWorldPendingGameOverAction,

  [WorldActionTypeEnum.WORLD_WIN]: resolveWorldWinAction,
  [WorldActionTypeEnum.WORLD_EXPLODE]: resolveWorldExplodeAction,
  [WorldActionTypeEnum.WORLD_INIT_EXPLODE]: resolveWorldInitExplodeAction,
  [WorldActionTypeEnum.WORLD_CLEANUP_EXPLODE]: resolveWorldCleanupExplodeAction,
  [WorldActionTypeEnum.WORLD_DEAL_DAMAGE]: resolveWorldDealDamageAction,
  [WorldActionTypeEnum.WORLD_BLOCK]: resolveWorldBlockAction,
  [WorldActionTypeEnum.WORLD_CLEANUP_BLOCK]: resolveWorldCleanupBlockAction,
  [WorldActionTypeEnum.WORLD_INIT_BLOCK]: resolveWorldInitBlockAction,
  [WorldActionTypeEnum.WORLD_POKE]: resolveWorldPokeAction,
  [WorldActionTypeEnum.WORLD_REST]: resolveWorldRestAction,
} satisfies ActionResolverMap<WorldAction>
