import type { GameState } from "../../state";
import type { Action } from "../log";

export enum Direction {
  LEFT,
  RIGHT,
}

export enum PlayerActionType {
  MOVE = "MOVE",
  PICK_UP = "PICK_UP",
  PICK_UP_UNPACK = "PICK_UP_UNPACK",
  EQUIP_ITEM = "EQUIP_ITEM",
  UNEQUIP_ITEM = "UNEQUIP_ITEM",
  ATTACK = "ATTACK",
}

export enum WorldActionType {
  DROP_ITEM = "DROP_ITEM",
  REMOVE_ENTITY = "REMOVE_ENTITY",
}
export type ActionType = PlayerActionType | WorldActionType;

export type InvSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type EqSlot = 1;

export type PlayerAction =
  | { type: PlayerActionType.MOVE; direction: Direction }
  | { type: PlayerActionType.PICK_UP }
  | { type: PlayerActionType.PICK_UP_UNPACK }
  | {
      type: PlayerActionType.EQUIP_ITEM;
      invSlot: InvSlot;
      eqSlot: EqSlot;
    }
  | {
      type: PlayerActionType.UNEQUIP_ITEM;
      eqSlot: EqSlot;
    }
  | { type: PlayerActionType.ATTACK; targetPosition: number };

export enum WorldActionEntityType {
  MOB = "MOB",
  PLAYER = "PLAYER",
  OBJECT = "OBJECT",
}

export type WorldAction =
  | {
      type: WorldActionType.DROP_ITEM;
      targetPosition: number;
      entityType: WorldActionEntityType.PLAYER;
      entityId: undefined;
      itemId: string;
    }
  | {
      type: WorldActionType.DROP_ITEM;
      targetPosition: number;
      entityType: WorldActionEntityType.MOB;
      entityId: string;
      itemId: string;
    }
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
export type GameAction = PlayerAction | WorldAction;

export type ActionResolution = {
  nextState: GameState;
  consumesTurn: boolean;
  pendingActions: GameAction[];
  action?: Action;
};
