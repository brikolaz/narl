export enum WorldActionType {
  DROP_ITEM = "DROP_ITEM",
  REMOVE_ENTITY = "REMOVE_ENTITY",
  CURSE_ITEM = "CURSE_ITEM",
}

export enum WorldActionEntityType {
  MOB = "MOB",
  PLAYER = "PLAYER",
  OBJECT = "OBJECT",
}

export type WorldDropItemAction =
  | {
      type: WorldActionType.DROP_ITEM;
      targetPosition: number;
      entityType: WorldActionEntityType.PLAYER;
      entityId: undefined;
      itemId: string | undefined;
    }
  | {
      type: WorldActionType.DROP_ITEM;
      targetPosition: number;
      entityType: WorldActionEntityType.MOB;
      entityId: string;
      itemId: string;
    };
export type WorldRemoveEntityAction =
  | {
      type: WorldActionType.REMOVE_ENTITY;
      entityId: string;
      entityType: WorldActionEntityType.MOB;
      position: number;
    }
  | {
      type: WorldActionType.REMOVE_ENTITY;
      entityId: undefined;
      entityType: WorldActionEntityType.PLAYER;
      position: number;
    };
export type WorldCurseItemAction = {
  type: WorldActionType.CURSE_ITEM;
  itemId: string;
};

export type WorldAction =
  | WorldDropItemAction
  | WorldRemoveEntityAction
  | WorldCurseItemAction;
