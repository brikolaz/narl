import type { GameState } from "../../../state/state";
import type { GameAction } from "../../actions/types";
import { getInternalLogAction } from "../../log/log";
import { getLastFallbackMessage, type KeyboardToActionChain } from "./chain";
import { createKeyboardToAction } from "./create";

export const mapKeyboardEventToAction = (
  event: KeyboardEvent,
  keyboardChain: KeyboardToActionChain,
  gameState: GameState,
): GameAction | undefined => {
  if (event.key === "Escape" && keyboardChain) {
    keyboardChain = undefined;
    return getInternalLogAction("Action canceled");
  }

  const root = createKeyboardToAction(gameState);
  const currentCommands = keyboardChain?.current ?? root;
  const command = currentCommands[event.key];

  if (!command) {
    const fallback = getLastFallbackMessage(keyboardChain);

    if (fallback !== undefined) {
      return getInternalLogAction(fallback);
    }

    return undefined;
  }

  if (command.action) {
    keyboardChain = undefined;
    return command.action;
  }

  if (command.next && keyboardChain) {
    keyboardChain = {
      current: command.next(),
      history: [...(keyboardChain.history ?? []), command],
    };
    return command.message ? getInternalLogAction(command.message) : undefined;
  }

  return undefined;
};
