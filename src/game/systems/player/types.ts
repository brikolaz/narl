import type { InvSlot } from "../containers/types";
import type { Direction } from "../turn/types";
import type { Enum, EnumType } from "../../../core/ecs/Enum";
import type { EqSlot } from "../eq/eq";

export const PlayerActionType = {
  MOVE: "PLAYER_MOVE",
  PICK_UP: "PLAYER_PICK_UP",
  PICK_UP_UNPACK: "PLAYER_PICK_UP_UNPACK",
  EQUIP_ITEM: "PLAYER_EQUIP_ITEM",
  UNEQUIP_ITEM: "PLAYER_UNEQUIP_ITEM",
  ATTACK: "PLAYER_ATTACK",
  MOVE_ITEM: "PLAYER_MOVE_ITEM",
  DROP_ITEM: "PLAYER_DROP_ITEM",
  INSPECT_INV: "PLAYER_INSPECT_INV",
  INSPECT_EQ: "PLAYER_INSPECT_EQ",
} as const satisfies Enum;
export type PlayerActionType = EnumType<typeof PlayerActionType>;

export enum PlayerDropItemActionReason {
  MANUAL = "MANUAL",
  BACKPACK_FULL = "BACKPACK_FULL",
}

export type PlayerDropItemAction = {
  type: typeof PlayerActionType.DROP_ITEM;
  targetPosition: number;
  invSlot: InvSlot | undefined;
  eqSlot: EqSlot | undefined;
  reason: PlayerDropItemActionReason;
};
export type PlayerMoveAction = {
  type: typeof PlayerActionType.MOVE;
  direction: Direction;
};
export type PlayerPickUpAction = { type: typeof PlayerActionType.PICK_UP };
export type PlayerPickUpUnpackAction = {
  type: typeof PlayerActionType.PICK_UP_UNPACK;
};
export type PlayerEquipItemAction = {
  type: typeof PlayerActionType.EQUIP_ITEM;
  invSlot: InvSlot;
  eqSlot: EqSlot;
};
export type PlayerUnequipItemAction = {
  type: typeof PlayerActionType.UNEQUIP_ITEM;
  eqSlot: EqSlot;
};
export type PlayerAttackAction = {
  type: typeof PlayerActionType.ATTACK;
  targetPosition: number;
};
export type PlayerInspectInvAction = {
  type: typeof PlayerActionType.INSPECT_INV;
  invSlot: InvSlot;
};
export type PlayerInspectEqAction = {
  type: typeof PlayerActionType.INSPECT_EQ;
  eqSlot: EqSlot
};
export type PlayerMoveItemAction = {
  type: typeof PlayerActionType.MOVE_ITEM;
  fromSlot: InvSlot;
  toSlot: InvSlot;
};

export type PlayerAction =
  | PlayerDropItemAction
  | PlayerMoveAction
  | PlayerPickUpAction
  | PlayerPickUpUnpackAction
  | PlayerEquipItemAction
  | PlayerUnequipItemAction
  | PlayerAttackAction
  | PlayerMoveItemAction
  | PlayerInspectInvAction
  | PlayerInspectEqAction;
