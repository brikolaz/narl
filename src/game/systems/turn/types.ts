import { createEnum, type EnumType } from "../../../utils/types/Enum"

export const DirectionEnum = createEnum("LEFT", "RIGHT")
export type DirectionEnum = EnumType<typeof DirectionEnum>
