import type { Action } from "../log";

export enum Direction {
  LEFT,
  RIGHT,
}

export enum GameActionType {
  MOVE,
  PICK_UP,
  EQUIP_ITEM,
  UNEQUIP_ITEM,
  ATTACK,
}

export type InvSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type EqSlot = 1;

export type GameAction =
  | { type: GameActionType.MOVE; direction: Direction }
  | { type: GameActionType.PICK_UP }
  | {
      type: GameActionType.EQUIP_ITEM;
      invSlot: InvSlot;
      eqSlot: EqSlot;
    }
  | {
      type: GameActionType.UNEQUIP_ITEM;
      eqSlot: EqSlot;
    }
  | { type: GameActionType.ATTACK; targetPosition: number };

export type ActionResolution<TGameState> = {
  nextState: TGameState;
  consumesTurn: boolean;
  pendingActions: GameAction[];
  action?: Action;
};
