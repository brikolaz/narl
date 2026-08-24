import type { ActionResolverMap } from "../actions/types";
import { resolvePlayerAttackAction } from "../attack/resolvePlayerAttackAction";
import { resolvePlayerDropItemAction } from "../drop/resolvePlayerDropItemAction";
import { resolveEquipAction } from "../eq/resolveEquipAction";
import { resolveUnequipAction } from "../eq/resolveUnequipAction";
import { resolveInspectEqAction } from "../inspect/resolveInspectEqAction";
import { resolveInspectInvAction } from "../inspect/resolveInspectInvAction";
import { resolveMoveItemAction } from "../moveItem/resolveMoveItemAction";
import { resolvePlayerMoveAction } from "../movement/resolvePlayerMoveAction";
import { resolvePickUpAction } from "../pickUp/resolvePickUpAction";
import { resolvePickUpUnpack } from "../pickUp/resolvePickUpUnpack";
import { resolvePokeAction } from "../poke/resolvePokeAction";
import { resolvePlayerWaitAction } from "../wait/resolvePlayerWaitAction";

import { PlayerActionType, type PlayerAction } from "./types";

export const playerActionResolvers = {
  [PlayerActionType.MOVE]: resolvePlayerMoveAction,
  [PlayerActionType.PICK_UP]: resolvePickUpAction,
  [PlayerActionType.PICK_UP_UNPACK]: resolvePickUpUnpack,
  [PlayerActionType.EQUIP_ITEM]: resolveEquipAction,
  [PlayerActionType.UNEQUIP_ITEM]: resolveUnequipAction,
  [PlayerActionType.ATTACK]: resolvePlayerAttackAction,
  [PlayerActionType.MOVE_ITEM]: resolveMoveItemAction,
  [PlayerActionType.DROP_ITEM]: resolvePlayerDropItemAction,
  [PlayerActionType.INSPECT_INV]: resolveInspectInvAction,
  [PlayerActionType.INSPECT_EQ]: resolveInspectEqAction,
  [PlayerActionType.POKE]: resolvePokeAction,
  [PlayerActionType.WAIT]: resolvePlayerWaitAction,
} satisfies ActionResolverMap<PlayerAction>;
