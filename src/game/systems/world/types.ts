import type { Enum, EnumType } from "../../../utils/types/Enum";
import type { Id } from "../../../core/model/Id";

export const WorldActionType = {
  DROP_ITEM: "DROP_ITEM",
  GAIN_EXP: "GAIN_EXP",
  KILL: "KILL",
  REMOVE_ENTITY: "REMOVE_ENTITY",
  ATTACK: "ATTACK",
  CURSE: "CURSE",
  DISABLE: "DISABLE",
  BLEED: "BLEED",
  INIT_BLEED: "INIT_BLEED",
  CLEANUP_BLEED: "CLEANUP_BLEED",
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
  sourcePos: number;
  mobId: Id;
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

export type WorldAction =
  WorldDropItemAction | WorldGainExpAction | WorldKillAction | WorldRemoveEntityAction | WorldAttackAction | WorldCurseAction | WorldDisableAction | WorldBleedAction | WorldInitBleedAction | WorldCleanupBleedAction;
