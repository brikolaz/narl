import { AxeEntity } from "./Axe/AxeEntity"

export const AxeEntityVariants = [AxeEntity.type] as const

export type AxeEntityVariants = (typeof AxeEntityVariants)[number]
