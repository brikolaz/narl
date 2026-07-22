import type { Id } from "../../../core/ecs/Id";

// todo: use Symbols
export enum WorldActionType {
  DROP_ITEM = "WORLD_DROP_ITEM",
  GAIN_EXP = "WORLD_GAIN_EXP",
  KILL = "WORLD_KILL",
  REMOVE_ENTITY = "WORLD_REMOVE_ENTITY",
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
  | WorldAttackAction;
