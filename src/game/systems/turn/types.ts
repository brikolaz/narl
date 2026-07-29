import type { Enum, EnumType } from "../../../utils/types/Enum";

export const Direction = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
} as const satisfies Enum;
export type Direction = EnumType<typeof Direction>;
