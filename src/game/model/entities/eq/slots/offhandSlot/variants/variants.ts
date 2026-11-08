import { OffhandSlotEntity } from "./OffhandSlot/OffhandSlotEntity"

export const OffhandSlotEntityVariants = [OffhandSlotEntity.type] as const

export type OffhandSlotEntityVariants =
  (typeof OffhandSlotEntityVariants)[number]
