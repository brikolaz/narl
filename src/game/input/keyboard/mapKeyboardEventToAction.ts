import type { GameAction } from "../../systems/actions/types";
import { getInternalLogAction } from "../../systems/log/log";
import {
  getLastFallbackMessage,
  type KeyboardToActionChain,
  type KeyboardToActionCommand,
} from "./chain";
import { createKeyboardToAction } from "./create";
import { isGameAction } from "./guards";

type KeyboardEventResult = {
  action: GameAction | undefined;
  keyboardChain: KeyboardToActionChain;
};

type ActiveKeyboardToActionChain = NonNullable<KeyboardToActionChain>;

const resolveCommandChain = (
  chain: KeyboardToActionCommand | KeyboardToActionCommand[],
) => {
  return Array.isArray(chain) ? chain : [chain];
};

const resolveCommand = (
  chain: KeyboardToActionCommand | KeyboardToActionCommand[],
) => {
  return Array.isArray(chain) ? chain[0] : chain;
};

const activateChainStep = (
  keyboardChain: ActiveKeyboardToActionChain,
  step: number,
): KeyboardEventResult => {
  const command = keyboardChain.commands[step];

  keyboardChain.step = step;
  keyboardChain.history = keyboardChain.commands.slice(0, step + 1);

  if (isGameAction(command.action)) {
    return { action: command.action, keyboardChain: undefined };
  }

  const result = command.action();

  if (isGameAction(result)) {
    return { action: result, keyboardChain: undefined };
  }

  keyboardChain.current = result ?? {};

  return {
    action: command.message ? getInternalLogAction(command.message) : undefined,
    keyboardChain,
  };
};

export const mapKeyboardEventToAction = (
  event: KeyboardEvent,
  keyboardChain: KeyboardToActionChain,
): KeyboardEventResult => {
  if (event.code === "Escape" && keyboardChain) {
    keyboardChain.commands[keyboardChain.step]?.cleanup?.();

    if (keyboardChain.step > 0) {
      const previousStep = keyboardChain.step - 1;
      const previousMessage = keyboardChain.commands[previousStep]?.message;
      const result = activateChainStep(
        keyboardChain,
        previousStep,
      );

      return {
        action: getInternalLogAction(
          previousMessage
            ? ["Step canceled", previousMessage]
            : "Step canceled",
        ),
        keyboardChain: result.keyboardChain,
      };
    }

    return {
      action: getInternalLogAction("Action canceled"),
      keyboardChain: undefined,
    };
  }

  const root = createKeyboardToAction();
  const currentCommands = keyboardChain?.current ?? root;
  const commands = currentCommands[event.code];

  if (!commands) {
    const fallback = getLastFallbackMessage(keyboardChain);

    if (fallback !== undefined) {
      return {
        action: getInternalLogAction(fallback),
        keyboardChain,
      };
    }

    return { action: undefined, keyboardChain };
  }

  const nextKeyboardChain: KeyboardToActionChain = keyboardChain ?? {
    current: {},
    commands: resolveCommandChain(commands),
    step: 0,
    history: [],
  };

  const command = keyboardChain?.current
    ? resolveCommand(keyboardChain?.current[event.code])
    : nextKeyboardChain.commands[nextKeyboardChain.step];

  if (isGameAction(command.action)) {
    return { action: command.action, keyboardChain: undefined };
  }
  const result = command.action();
  if (result === undefined) {
    const nextStep = nextKeyboardChain.step + 1;
    const nextCommand = nextKeyboardChain.commands[nextStep];

    if (!nextCommand) {
      return { action: undefined, keyboardChain: nextKeyboardChain };
    }

    return activateChainStep(nextKeyboardChain, nextStep);
  }
  if (isGameAction(result)) {
    return { action: result, keyboardChain: undefined };
  }

  nextKeyboardChain.current = result;
  nextKeyboardChain.history.push(command);
  return {
    action: command.message ? getInternalLogAction(command.message) : undefined,
    keyboardChain: nextKeyboardChain,
  };
};
