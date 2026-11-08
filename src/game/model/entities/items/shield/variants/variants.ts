import { ShieldEntity } from "./Shield/ShieldEntity"

export const ShieldEntityVariants = [ShieldEntity.type] as const

export type ShieldEntityVariants = (typeof ShieldEntityVariants)[number]
