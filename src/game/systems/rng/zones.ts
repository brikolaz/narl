import type { Enum, EnumType } from "../../../core/ecs/Enum";
import { MAX_WORLD_SIZE } from "../../../utils/constants";

export const Zone = {
  START: "start",
  EARLY: "early",
  LOW: "low",
  MID: "mid",
  HIGH: "high",
  LATE: "late",
  FINAL: "final",
} as const satisfies Enum;
export type Zone = EnumType<typeof Zone>;

export const getZone = (position: number): Zone => {
  if (position === 0) return Zone.START;
  if (position < 50) return Zone.EARLY;
  if (position < 300) return Zone.LOW;
  if (position < 900) return Zone.MID;
  if (position < 1500) return Zone.HIGH;
  if (position < MAX_WORLD_SIZE - 1) return Zone.LATE;

  return Zone.FINAL;
};
