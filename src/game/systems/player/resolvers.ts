import type { GameState } from "../../state/state";
import type { ActionResolution } from "../actions/types";
import { resolvePlayerAttackAction } from "../attack/resolvePlayerAttackAction";
import { resolvePlayerCurseItemAction } from "../curse/resolvePlayerCurseItemAction";
import { resolvePlayerDropItemAction } from "../drop/resolvePlayerDropItemAction";
import { resolveEquipAction } from "../eq/resolveEquipAction";
import { resolveUnequipAction } from "../eq/resolveUnequipAction";
import { resolveInspectEqAction } from "../inspect/resolveInspectEqAction";
import { resolveInspectInvAction } from "../inspect/resolveInspectInvAction";
import { resolveMoveItemAction } from "../moveItem/resolveMoveItemAction";
import { resolveMoveAction } from "../movement/resolveMoveAction";
import { resolvePickUpAction } from "../pickUp/resolvePickUpAction";
import { resolvePickUpUnpack } from "../pickUp/resolvePickUpUnpack";

import { PlayerActionType } from "./types";

type AnyPlayerResolver = (state: GameState, action: any) => ActionResolution;

export const playerActionResolvers = {
  [PlayerActionType.MOVE]: resolveMoveAction,
  [PlayerActionType.PICK_UP]: resolvePickUpAction,
  [PlayerActionType.PICK_UP_UNPACK]: resolvePickUpUnpack,
  [PlayerActionType.EQUIP_ITEM]: resolveEquipAction,
  [PlayerActionType.UNEQUIP_ITEM]: resolveUnequipAction,
  [PlayerActionType.ATTACK]: resolvePlayerAttackAction,
  [PlayerActionType.MOVE_ITEM]: resolveMoveItemAction,
  [PlayerActionType.DROP_ITEM]: resolvePlayerDropItemAction,
  [PlayerActionType.INSPECT_INV]: resolveInspectInvAction,
  [PlayerActionType.INSPECT_EQ]: resolveInspectEqAction,
  [PlayerActionType.CURSE_ITEM]: resolvePlayerCurseItemAction,
} satisfies Record<PlayerActionType, AnyPlayerResolver>;
