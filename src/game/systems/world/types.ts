import { createEnum, type EnumType } from "../../../utils/types/Enum"
import type { Id } from "../../../core/model/Id"
import type { DirectionEnum } from "../turn/types"

export const WorldActionTypeEnum = createEnum(
  "WORLD_DROP_ITEM",
  "WORLD_GAIN_EXP",
  "WORLD_KILL",
  "WORLD_REMOVE_ENTITY",
  "WORLD_ATTACK",
  "WORLD_CURSE",
  "WORLD_DISABLE",
  "WORLD_BLEED",
  "WORLD_INIT_BLEED",
  "WORLD_CLEANUP_BLEED",
  "WORLD_MOVE",
  "WORLD_MOB_AI",
  "WORLD_HEAL",
  "WORLD_GAME_OVER",
  "WORLD_PENDING_GAME_OVER",
  "WORLD_WIN",
  "WORLD_EXPLODE",
  "WORLD_INIT_EXPLODE",
  "WORLD_CLEANUP_EXPLODE",
  "WORLD_DEAL_DAMAGE",
  "WORLD_BLOCK",
  "WORLD_CLEANUP_BLOCK",
  "WORLD_INIT_BLOCK",
  "WORLD_POKE",
  "WORLD_REST",
)
export const WorldKillActionReasonEnum = createEnum("ATTACK", "EXPLODE")
export type WorldKillActionReasonEnum = EnumType<
  typeof WorldKillActionReasonEnum
>

export const WorldDealDamageActionReasonEnum = createEnum("ATTACK", "EXPLODE")
type WorldDealDamageActionReasonEnum = EnumType<
  typeof WorldDealDamageActionReasonEnum
>

export type WorldDropItemAction = {
  type: typeof WorldActionTypeEnum.WORLD_DROP_ITEM
  targetPosition: number
  entityId: Id
  itemId: Id
}
export type WorldKillAction = {
  type: typeof WorldActionTypeEnum.WORLD_KILL
  entityId: Id
  position: number
  reason: WorldKillActionReasonEnum
}
export type WorldGainExpAction = {
  type: typeof WorldActionTypeEnum.WORLD_GAIN_EXP
  exp: number
}
export type WorldRemoveEntityAction = {
  type: typeof WorldActionTypeEnum.WORLD_REMOVE_ENTITY
  entityId: Id
  position: number
}
export type WorldAttackAction = {
  type: typeof WorldActionTypeEnum.WORLD_ATTACK
  sourceId: Id
  targetId: Id
}

export type WorldCurseAction = {
  type: typeof WorldActionTypeEnum.WORLD_CURSE
  entityId: Id
}

export type WorldDisableAction = {
  type: typeof WorldActionTypeEnum.WORLD_DISABLE
  entityId: Id
}

export type WorldBleedAction = {
  type: typeof WorldActionTypeEnum.WORLD_BLEED
  bleedId: Id
}

export type WorldInitBleedAction = {
  type: typeof WorldActionTypeEnum.WORLD_INIT_BLEED
  bleedId: Id
  duration: number
}

export type WorldCleanupBleedAction = {
  type: typeof WorldActionTypeEnum.WORLD_CLEANUP_BLEED
  bleedId: Id
}

export type WorldMoveAction = {
  type: typeof WorldActionTypeEnum.WORLD_MOVE
  entityId: Id
  direction: DirectionEnum
}

export type WorldMobAiAction = {
  type: typeof WorldActionTypeEnum.WORLD_MOB_AI
  mobId: Id
}

export type WorldHealAction = {
  type: typeof WorldActionTypeEnum.WORLD_HEAL
  entityId: Id
  value: number
}

export type WorldGameOverAction = {
  type: typeof WorldActionTypeEnum.WORLD_GAME_OVER
}

export type WorldPendingGameOverAction = {
  type: typeof WorldActionTypeEnum.WORLD_PENDING_GAME_OVER
}

export type WorldWinAction = { type: typeof WorldActionTypeEnum.WORLD_WIN }

export type WorldExplodeAction = {
  type: typeof WorldActionTypeEnum.WORLD_EXPLODE
  entityId: Id
}

export type WorldInitExplodeAction = {
  type: typeof WorldActionTypeEnum.WORLD_INIT_EXPLODE
  entityId: Id
}

export type WorldCleanupExplodeAction = {
  type: typeof WorldActionTypeEnum.WORLD_CLEANUP_EXPLODE
  entityId: Id
}

export type WorldDealDamageAction = {
  type: typeof WorldActionTypeEnum.WORLD_DEAL_DAMAGE
  sourceId: Id
  targetId: Id
  dmg: number
  reason: WorldDealDamageActionReasonEnum
}

export type WorldBlockAction = {
  type: typeof WorldActionTypeEnum.WORLD_BLOCK
  entityId: Id
}

export type WorldCleanupBlockAction = {
  type: typeof WorldActionTypeEnum.WORLD_CLEANUP_BLOCK
  defId: Id
}

export type WorldInitBlockAction = {
  type: typeof WorldActionTypeEnum.WORLD_INIT_BLOCK
  entityId: Id
}

export type WorldPokeAction = {
  type: typeof WorldActionTypeEnum.WORLD_POKE
  sourceId: Id
  direction: DirectionEnum
}

export type WorldRestAction = {
  type: typeof WorldActionTypeEnum.WORLD_REST
  entityId: Id
}

export type WorldAction =
  | WorldDropItemAction
  | WorldGainExpAction
  | WorldKillAction
  | WorldRemoveEntityAction
  | WorldAttackAction
  | WorldCurseAction
  | WorldDisableAction
  | WorldBleedAction
  | WorldInitBleedAction
  | WorldCleanupBleedAction
  | WorldMoveAction
  | WorldMobAiAction
  | WorldHealAction
  | WorldGameOverAction
  | WorldPendingGameOverAction
  | WorldWinAction
  | WorldExplodeAction
  | WorldInitExplodeAction
  | WorldCleanupExplodeAction
  | WorldDealDamageAction
  | WorldBlockAction
  | WorldCleanupBlockAction
  | WorldInitBlockAction
  | WorldPokeAction
  | WorldRestAction
