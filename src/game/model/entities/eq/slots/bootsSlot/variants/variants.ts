import { BootsSlotEntity } from "./BootsSlot/BootsSlotEntity"

export const BootsSlotEntityVariants = [BootsSlotEntity.type] as const

export type BootsSlotEntityVariants = (typeof BootsSlotEntityVariants)[number]
