import { BootsEntity } from "./Boots/BootsEntity"

export const BootsEntityVariants = [BootsEntity.type] as const

export type BootsEntityVariants = (typeof BootsEntityVariants)[number]
