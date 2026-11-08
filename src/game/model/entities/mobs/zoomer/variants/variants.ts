import { ZoomerEntity } from "./Zoomer/ZoomerEntity"

export const ZoomerEntityVariants = [ZoomerEntity.type] as const

export type ZoomerEntityVariants = (typeof ZoomerEntityVariants)[number]
