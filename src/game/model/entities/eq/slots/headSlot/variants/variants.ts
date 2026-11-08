import { HeadSlotEntity } from "./HeadSlot/HeadSlotEntity"

export const HeadSlotEntityVariants = [HeadSlotEntity.type] as const

export type HeadSlotEntityVariants = (typeof HeadSlotEntityVariants)[number]
