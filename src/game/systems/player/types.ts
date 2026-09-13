import type { InvSlot } from "../containers/types"
import type { DirectionEnum } from "../turn/types"
import { createEnum, type EnumType } from "../../../utils/types/Enum"
import type { EqSlot } from "../eq/eq"

export const PlayerActionTypeEnum = createEnum(
  "PLAYER_MOVE",
  "PLAYER_PICK_UP",
  "PLAYER_PICK_UP_UNPACK",
  "PLAYER_EQUIP_ITEM",
  "PLAYER_UNEQUIP_ITEM",
  "PLAYER_ATTACK",
  "PLAYER_MOVE_ITEM",
  "PLAYER_DROP_ITEM",
  "PLAYER_INSPECT_INV",
  "PLAYER_INSPECT_EQ",
  "PLAYER_WAIT",
  "PLAYER_MELEE_ATTACK",
  "PLAYER_RANGED_ATTACK",
)
export type PlayerActionTypeEnum = EnumType<typeof PlayerActionTypeEnum>

export const PlayerDropItemActionReasonEnum = createEnum(
  "MANUAL",
  "BACKPACK_FULL",
)
type PlayerDropItemActionReasonEnum = EnumType<
  typeof PlayerDropItemActionReasonEnum
>

export type PlayerDropItemAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_DROP_ITEM
  targetPosition: number
  invSlot: InvSlot | undefined
  eqSlot: EqSlot | undefined
  reason: PlayerDropItemActionReasonEnum
}
export type PlayerMoveAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_MOVE
  direction: DirectionEnum
}
export type PlayerPickUpAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_PICK_UP
}
export type PlayerPickUpUnpackAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_PICK_UP_UNPACK
}
export type PlayerEquipItemAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_EQUIP_ITEM
  invSlot: InvSlot
}
export type PlayerUnequipItemAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_UNEQUIP_ITEM
  eqSlot: EqSlot
}
export type PlayerAttackAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_ATTACK
  direction: DirectionEnum
}
export type PlayerInspectInvAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_INSPECT_INV
  invSlot: InvSlot
}
export type PlayerInspectEqAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_INSPECT_EQ
  eqSlot: EqSlot
}
export type PlayerMoveItemAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_MOVE_ITEM
  fromSlot: InvSlot
  toSlot: InvSlot
}

export type PlayerWaitAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_WAIT
}

export type PlayerMeleeAttackAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_MELEE_ATTACK
  targetPosition: number
}

export type PlayerRangedAttackAction = {
  type: typeof PlayerActionTypeEnum.PLAYER_RANGED_ATTACK
  direction: DirectionEnum
}

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
  | PlayerInspectEqAction
  | PlayerWaitAction
  | PlayerMeleeAttackAction
  | PlayerRangedAttackAction
