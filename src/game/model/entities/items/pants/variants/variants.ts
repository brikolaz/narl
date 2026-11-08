import { PantsEntity } from "./Pants/PantsEntity"

export const PantsEntityVariants = [PantsEntity.type] as const

export type PantsEntityVariants = (typeof PantsEntityVariants)[number]
