import type { Enum, EnumType } from "../../../core/ecs/Enum";

export const EqSlot = {
  HEAD: 1,
  AMULET: 2,
  MAIN_HAND: 3,
  ARMOR: 4,
  OFFHAND: 5,
  RING1: 6,
  PANTS: 7,
  RING2: 8,
  BOOTS: 9,
} as const satisfies Enum;
export type EqSlot = EnumType<typeof EqSlot>
