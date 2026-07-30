import { resetHighlightedEqSlot } from "../../render/state/highlights";
import type { GameAction } from "../../systems/actions/types";
import { getInternalLogAction } from "../../systems/log/log";
import { getLastFallbackMessage, type KeyboardToActionChain } from "./chain";
import { createKeyboardToAction } from "./create";

type KeyboardEventResult = {
  action: GameAction | undefined;
  keyboardChain: KeyboardToActionChain;
};

export const mapKeyboardEventToAction = (
  event: KeyboardEvent,
  keyboardChain: KeyboardToActionChain,
): KeyboardEventResult => {
  if (event.code === "Escape" && keyboardChain) {
    resetHighlightedEqSlot(); // TODO: move to a better place

    return {
      action: getInternalLogAction("Action canceled"),
      keyboardChain: undefined,
    };
  }

  const root = createKeyboardToAction();
  const currentCommands = keyboardChain?.current ?? root;
  const command = currentCommands[event.code];

  if (!command) {
    const fallback = getLastFallbackMessage(keyboardChain);

    if (fallback !== undefined) {
      return {
        action: getInternalLogAction(fallback),
        keyboardChain,
      };
    }

    return { action: undefined, keyboardChain };
  }

  if (command.action) {
    if (typeof command.action === "object") {
      return { action: command.action, keyboardChain: undefined };
    }
    const result = command.action();
    if (result) {
      return { action: result, keyboardChain: undefined };
    }
  }

  if (command.next) {
    const nextKeyboardChain: KeyboardToActionChain = {
      current: command.next(),
      history: [...(keyboardChain?.history ?? []), command],
    };
    return {
      action: command.message
        ? getInternalLogAction(command.message)
        : undefined,
      keyboardChain: nextKeyboardChain,
    };
  }

  return { action: undefined, keyboardChain };
};
