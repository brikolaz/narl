import type { Enum, EnumType } from "../../../utils/types/Enum";
import type { Id } from "../../../core/model/Id";
import type { Direction } from "../turn/types";

export const WorldActionType = {
  DROP_ITEM: "WORLD_DROP_ITEM",
  GAIN_EXP: "WORLD_GAIN_EXP",
  KILL: "WORLD_KILL",
  REMOVE_ENTITY: "WORLD_REMOVE_ENTITY",
  ATTACK: "WORLD_ATTACK",
  CURSE: "WORLD_CURSE",
  DISABLE: "WORLD_DISABLE",
  BLEED: "WORLD_BLEED",
  INIT_BLEED: "WORLD_INIT_BLEED",
  CLEANUP_BLEED: "WORLD_CLEANUP_BLEED",
  MOVE: "WORLD_MOVE",
  MOB_AI: "WORLD_MOB_AI",
  HEAL: "WORLD_HEAL",
  GAME_OVER: "WORLD_GAME_OVER",
  PENDING_GAME_OVER: "WORLD_PENDING_GAME_OVER",
} as const satisfies Enum;
export type WorldActionType = EnumType<typeof WorldActionType>;

export type WorldDropItemAction = {
  type: typeof WorldActionType.DROP_ITEM;
  targetPosition: number;
  entityId: Id;
  itemId: Id;
};
export type WorldKillAction = {
  type: typeof WorldActionType.KILL;
  entityId: Id;
  position: number;
};
export type WorldGainExpAction = {
  type: typeof WorldActionType.GAIN_EXP;
  exp: number;
};
export type WorldRemoveEntityAction = {
  type: typeof WorldActionType.REMOVE_ENTITY;
  entityId: Id;
  position: number;
};
export type WorldAttackAction = {
  type: typeof WorldActionType.ATTACK;
  sourceId: Id;
  targetId: Id;
};

export type WorldCurseAction = {
  type: typeof WorldActionType.CURSE;
  entityId: Id;
};

export type WorldDisableAction = {
  type: typeof WorldActionType.DISABLE;
  entityId: Id;
};

export type WorldBleedAction = {
  type: typeof WorldActionType.BLEED;
  bleedId: Id;
};

export type WorldInitBleedAction = {
  type: typeof WorldActionType.INIT_BLEED;
  bleedId: Id;
};

export type WorldCleanupBleedAction = {
  type: typeof WorldActionType.CLEANUP_BLEED;
  bleedId: Id;
};

export type WorldMoveAction = {
  type: typeof WorldActionType.MOVE;
  entityId: Id;
  direction: Direction;
};

export type WorldMobAiAction = {
  type: typeof WorldActionType.MOB_AI;
  mobId: Id;
};

export type WorldHealAction = {
  type: typeof WorldActionType.HEAL;
  entityId: Id;
  value: number;
};

export type WorldGameOverAction = { type: typeof WorldActionType.GAME_OVER };

export type WorldPendingGameOverAction = {
  type: typeof WorldActionType.PENDING_GAME_OVER;
};

export type WorldAction =
  WorldDropItemAction | WorldGainExpAction | WorldKillAction | WorldRemoveEntityAction | WorldAttackAction | WorldCurseAction | WorldDisableAction | WorldBleedAction | WorldInitBleedAction | WorldCleanupBleedAction | WorldMoveAction | WorldMobAiAction | WorldHealAction | WorldGameOverAction | WorldPendingGameOverAction;
