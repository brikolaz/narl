import { MainHandSlotEntity } from "./MainHandSlot/MainHandSlotEntity"

export const MainHandSlotEntityVariants = [MainHandSlotEntity.type] as const

export type MainHandSlotEntityVariants =
  (typeof MainHandSlotEntityVariants)[number]
