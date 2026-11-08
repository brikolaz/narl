import { ArmorEntity } from "./Armor/ArmorEntity"

export const ArmorEntityVariants = [ArmorEntity.type] as const

export type ArmorEntityVariants = (typeof ArmorEntityVariants)[number]
