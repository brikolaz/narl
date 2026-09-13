import type { ActionResolverMap } from "../actions/types"
import { resolvePlayerAttackAction } from "../attack/resolvePlayerAttackAction"
import { resolvePlayerDropItemAction } from "../drop/resolvePlayerDropItemAction"
import { resolvePlayerEquipItemAction } from "../eq/resolvePlayerEquipItemAction"
import { resolvePlayerUnequipItemAction } from "../eq/resolvePlayerUnequipItemAction"
import { resolvePlayerInspectEqAction } from "../inspect/resolvePlayerInspectEqAction"
import { resolvePlayerInspectInvAction } from "../inspect/resolvePlayerInspectInvAction"
import { resolvePlayerMoveItemAction } from "../moveItem/resolvePlayerMoveItemAction"
import { resolvePlayerMoveAction } from "../movement/resolvePlayerMoveAction"
import { resolvePlayerPickUpAction } from "../pickUp/resolvePlayerPickUpAction"
import { resolvePlayerPickUpUnpackAction } from "../pickUp/resolvePlayerPickUpUnpackAction"
import { resolvePlayerWaitAction } from "../wait/resolvePlayerWaitAction"
import { resolvePlayerMeleeAttackAction } from "../meleeAttack/resolvePlayerMeleeAttackAction"
import { resolvePlayerRangedAttackAction } from "../rangedAttack/resolvePlayerRangedAttackAction"

import { PlayerActionTypeEnum, type PlayerAction } from "./types"

export const PLAYER_ACTION_RESOLVERS = {
  [PlayerActionTypeEnum.PLAYER_MOVE]: resolvePlayerMoveAction,
  [PlayerActionTypeEnum.PLAYER_PICK_UP]: resolvePlayerPickUpAction,
  [PlayerActionTypeEnum.PLAYER_PICK_UP_UNPACK]: resolvePlayerPickUpUnpackAction,
  [PlayerActionTypeEnum.PLAYER_EQUIP_ITEM]: resolvePlayerEquipItemAction,
  [PlayerActionTypeEnum.PLAYER_UNEQUIP_ITEM]: resolvePlayerUnequipItemAction,
  [PlayerActionTypeEnum.PLAYER_ATTACK]: resolvePlayerAttackAction,
  [PlayerActionTypeEnum.PLAYER_MOVE_ITEM]: resolvePlayerMoveItemAction,
  [PlayerActionTypeEnum.PLAYER_DROP_ITEM]: resolvePlayerDropItemAction,
  [PlayerActionTypeEnum.PLAYER_INSPECT_INV]: resolvePlayerInspectInvAction,
  [PlayerActionTypeEnum.PLAYER_INSPECT_EQ]: resolvePlayerInspectEqAction,
  [PlayerActionTypeEnum.PLAYER_WAIT]: resolvePlayerWaitAction,
  [PlayerActionTypeEnum.PLAYER_MELEE_ATTACK]: resolvePlayerMeleeAttackAction,
  [PlayerActionTypeEnum.PLAYER_RANGED_ATTACK]: resolvePlayerRangedAttackAction,
} satisfies ActionResolverMap<PlayerAction>
