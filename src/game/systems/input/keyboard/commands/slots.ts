import type { GameAction } from "../../../actions/types";
import type { EqSlot } from "../../../eq/types";
import type { InvSlot } from "../../../inv/types";
import type { KeyboardToAction } from "../chain";

export const keyToInvSlot = (key: string): InvSlot => {
  return Number(key) as InvSlot;
};

export const keyToEqSlot = (key: string): EqSlot => {
  return Number(key) as EqSlot;
};

export const createSlotActionCommands = <T extends number>(
  size: number | undefined,
  createAction: (slot: T) => GameAction,
  message?: string,
  fallback?: string,
): KeyboardToAction => {
  const commands: KeyboardToAction = {};

  for (let slot = 1; slot <= (size ?? 0); slot++) {
    commands[String(slot)] = {
      action: createAction(slot as T),
      message,
      fallback,
    };
  }

  return commands;
};

export const createSlotNextCommands = <T extends number>(
  size: number | undefined,
  nextCommand: (slot: T) => KeyboardToAction,
  message?: string,
  fallback?: string,
): KeyboardToAction => {
  const commands: KeyboardToAction = {};

  for (let slot = 1; slot <= (size ?? 0); slot++) {
    commands[String(slot)] = {
      next: () => nextCommand(slot as T),
      message,
      fallback,
    };
  }

  return commands;
};
