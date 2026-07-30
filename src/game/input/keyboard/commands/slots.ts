import type { GameAction } from "../../../systems/actions/types";
import type { InvSlot } from "../../../systems/containers/types";
import type { EqSlot } from "../../../systems/eq/eq";
import type { KeyboardToAction } from "../chain";

export const keyToInvSlot = (key: string): InvSlot => {
  return Number(key) as InvSlot;
};

export const keyToEqSlot = (key: string): EqSlot => {
  return Number(key) as EqSlot;
};

export const eqSlotToKey = (slot: EqSlot) => {
  return `Digit${slot}`;
};

export const createSlotActionCommands = <T extends number>(
  size: number | undefined,
  createAction: (slot: T) => GameAction,
  message?: string,
  fallback?: string,
): KeyboardToAction => {
  const commands: KeyboardToAction = {};

  for (let slot = 1; slot <= (size ?? 0); slot++) {
    commands[eqSlotToKey(slot)] = {
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
    commands[eqSlotToKey(slot)] = {
      next: () => nextCommand(slot as T),
      message,
      fallback,
    };
  }

  return commands;
};
