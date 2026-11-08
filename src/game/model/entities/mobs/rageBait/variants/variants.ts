import { RageBaitEntity } from "./RageBait/RageBaitEntity"

export const RageBaitEntityVariants = [RageBaitEntity.type] as const

export type RageBaitEntityVariants = (typeof RageBaitEntityVariants)[number]
