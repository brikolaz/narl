import type { Id } from "../../../core/ecs/Id";
import type { Symbols } from "../../../core/ecs/Symbols";

export const WorldActionType = {
  DROP_ITEM: Symbol("DROP_ITEM"),
  GAIN_EXP: Symbol("GAIN_EXP"),
  KILL: Symbol("KILL"),
  REMOVE_ENTITY: Symbol("REMOVE_ENTITY"),
  ATTACK: Symbol("ATTACK"),
  CURSE: Symbol("CURSE"),
  DISABLE: Symbol("DISABLE"),
} as const satisfies Symbols;

export type WorldActionType =
  (typeof WorldActionType)[keyof typeof WorldActionType];

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

export type WorldAction =
  | WorldDropItemAction
  | WorldGainExpAction
  | WorldKillAction
  | WorldRemoveEntityAction
  | WorldAttackAction
  | WorldCurseAction
  | WorldDisableAction;
