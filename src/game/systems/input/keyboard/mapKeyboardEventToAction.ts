import type { GameState } from "../../../state/state";
import type { GameAction } from "../../actions/types";
import { getInternalLogAction } from "../../log/log";
import { getLastFallbackMessage, type KeyboardToActionChain } from "./chain";
import { createKeyboardToAction } from "./create";

type KeyboardEventResult = {
  action: GameAction | undefined;
  keyboardChain: KeyboardToActionChain;
};

export const mapKeyboardEventToAction = (
  event: KeyboardEvent,
  keyboardChain: KeyboardToActionChain,
  gameState: GameState,
): KeyboardEventResult => {
  if (event.key === "Escape" && keyboardChain) {
    return {
      action: getInternalLogAction("Action canceled"),
      keyboardChain: undefined,
    };
  }

  const root = createKeyboardToAction(gameState);
  const currentCommands = keyboardChain?.current ?? root;
  const command = currentCommands[event.key];

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
    return { action: command.action, keyboardChain: undefined };
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
