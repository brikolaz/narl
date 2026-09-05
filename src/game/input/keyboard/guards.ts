import type { GameAction } from "../../systems/actions/types";

export const isGameAction = (
  value: unknown,
): value is GameAction =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  "type" in value;