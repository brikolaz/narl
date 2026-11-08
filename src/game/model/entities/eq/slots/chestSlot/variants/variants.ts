import { ChestSlotEntity } from "./ChestSlot/ChestSlotEntity"

export const ChestSlotEntityVariants = [ChestSlotEntity.type] as const

export type ChestSlotEntityVariants = (typeof ChestSlotEntityVariants)[number]
