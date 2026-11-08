import { PantsSlotEntity } from "./PantsSlot/PantsSlotEntity"

export const PantsSlotEntityVariants = [PantsSlotEntity.type] as const

export type PantsSlotEntityVariants = (typeof PantsSlotEntityVariants)[number]
