import { DickEntity } from "./Dick/DickEntity"

export const DickEntityVariants = [DickEntity.type] as const

export type DickEntityVariants = (typeof DickEntityVariants)[number]
