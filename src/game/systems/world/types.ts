export enum WorldActionType {
  DROP_ITEM = "WORLD_DROP_ITEM",
  KILL_ENTITY = "WORLD_KILL_ENTITY",
  CURSE_ITEM = "WORLD_CURSE_ITEM",
  ATTACK = "WORLD_ATTACK",
}

export enum WorldActionEntityType {
  MOB = "MOB",
  PLAYER = "PLAYER",
  OBJECT = "OBJECT",
}

export type WorldDropItemAction = {
  type: WorldActionType.DROP_ITEM;
  targetPosition: number;
  entityId: string;
  itemId: string;
};
export type WorldRemoveEntityAction = {
  type: WorldActionType.KILL_ENTITY;
  entityId: string;
  entityType: WorldActionEntityType;
  position: number;
};
export type WorldCurseItemAction = {
  type: WorldActionType.CURSE_ITEM;
  itemId: string;
};
export type WorldAttackAction = {
  type: WorldActionType.ATTACK;
  sourcePos: number;
  mobId: string;
};

export type WorldAction =
  | WorldDropItemAction
  | WorldRemoveEntityAction
  | WorldCurseItemAction
  | WorldAttackAction;
