import type { GameAction } from "../../systems/actions/types";
import type { KeyboardToAction } from "./chain";

export const isGameAction = (
  value: unknown,
): value is GameAction =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  "type" in value;

export const isKeyboardToAction = (
  value: unknown,
): value is KeyboardToAction =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  !("type" in value);