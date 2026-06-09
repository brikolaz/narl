import { resolveAttackAction } from "../attack/resolveAttackAction";
import { resolvePlayerDropItemAction } from "../drop/resolvePlayerDropItemAction";
import { resolveEquipAction } from "../eq/resolveEquipAction";
import { resolveUnequipAction } from "../eq/resolveUnequipAction";
import { resolveMoveItemAction } from "../moveItem/resolveMoveItemAction";
import { resolveMoveAction } from "../movement/resolveMoveAction";
import { resolvePickUpAction } from "../pickUp/resolvePickUpAction";
import { resolvePickUpUnpack } from "../pickUp/resolvePickUpUnpack";

import { PlayerActionType } from "./types";

type PlayerActionResolver =
  | typeof resolveMoveAction
  | typeof resolvePickUpAction
  | typeof resolvePickUpUnpack
  | typeof resolveEquipAction
  | typeof resolveUnequipAction
  | typeof resolveAttackAction
  | typeof resolveMoveItemAction
  | typeof resolvePlayerDropItemAction;

export const playerActionResolvers = {
  [PlayerActionType.MOVE]: resolveMoveAction,
  [PlayerActionType.PICK_UP]: resolvePickUpAction,
  [PlayerActionType.PICK_UP_UNPACK]: resolvePickUpUnpack,
  [PlayerActionType.EQUIP_ITEM]: resolveEquipAction,
  [PlayerActionType.UNEQUIP_ITEM]: resolveUnequipAction,
  [PlayerActionType.ATTACK]: resolveAttackAction,
  [PlayerActionType.MOVE_ITEM]: resolveMoveItemAction,
  [PlayerActionType.DROP_ITEM]: resolvePlayerDropItemAction,
} satisfies Record<PlayerActionType, PlayerActionResolver>;
