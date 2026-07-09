import type { Id } from "../../../core/ecs/Id";

export enum WorldActionType {
  DROP_ITEM = "WORLD_DROP_ITEM",
  GAIN_EXP = "WORLD_GAIN_EXP",
  KILL = "WORLD_KILL",
  REMOVE_ENTITY = "WORLD_REMOVE_ENTITY",
  CURSE_ITEM = "WORLD_CURSE_ITEM",
  ATTACK = "WORLD_ATTACK",
}

export type WorldDropItemAction = {
  type: WorldActionType.DROP_ITEM;
  targetPosition: number;
  entityId: Id;
  itemId: Id;
};
export type WorldKillAction = {
  type: WorldActionType.KILL;
  entityId: Id;
  position: number;
};
export type WorldGainExpAction = {
  type: WorldActionType.GAIN_EXP;
  exp: number;
};
export type WorldRemoveEntityAction = {
  type: WorldActionType.REMOVE_ENTITY;
  entityId: Id;
  position: number;
};
export type WorldCurseItemAction = {
  type: WorldActionType.CURSE_ITEM;
  itemId: Id;
};
export type WorldAttackAction = {
  type: WorldActionType.ATTACK;
  sourcePos: number;
  mobId: Id;
};

export type WorldAction =
  | WorldDropItemAction
  | WorldGainExpAction
  | WorldKillAction
  | WorldRemoveEntityAction
  | WorldCurseItemAction
  | WorldAttackAction;
