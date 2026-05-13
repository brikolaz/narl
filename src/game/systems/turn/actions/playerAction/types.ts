import type { EqSlot } from "../../../eq/types";
import type { InvSlot } from "../../../inv/types";
import type { Direction } from "../../types";

export enum PlayerActionType {
  MOVE = "MOVE",
  PICK_UP = "PICK_UP",
  PICK_UP_UNPACK = "PICK_UP_UNPACK",
  EQUIP_ITEM = "EQUIP_ITEM",
  UNEQUIP_ITEM = "UNEQUIP_ITEM",
  ATTACK = "ATTACK",
  MOVE_ITEM = "MOVE_ITEM",
}

export type PlayerMoveAction = {
  type: PlayerActionType.MOVE;
  direction: Direction;
};
export type PlayerPickUpAction = { type: PlayerActionType.PICK_UP };
export type PlayerPickUpUnpackAction = {
  type: PlayerActionType.PICK_UP_UNPACK;
};
export type PlayerEquipItemAction = {
  type: PlayerActionType.EQUIP_ITEM;
  invSlot: InvSlot;
  eqSlot: EqSlot;
};
export type PlayeerUnequipItemAction = {
  type: PlayerActionType.UNEQUIP_ITEM;
  eqSlot: EqSlot;
};
export type PlayerAttackAction = {
  type: PlayerActionType.ATTACK;
  targetPosition: number;
};
export type PlayerMoveItemAction = {
  type: PlayerActionType.MOVE_ITEM;
  fromSlot: InvSlot;
  toSlot: InvSlot;
};

export type PlayerAction =
  | PlayerMoveAction
  | PlayerPickUpAction
  | PlayerPickUpUnpackAction
  | PlayerEquipItemAction
  | PlayeerUnequipItemAction
  | PlayerAttackAction
  | PlayerMoveItemAction;
