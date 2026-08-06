import { getInternalLogAction } from "../../systems/log/log";
import {
  getLastFallbackMessage,
  type ActiveKeyboardToActionChain,
  type KeyboardEventResult,
  type KeyboardToActionChain,
  type KeyboardToActionCommand,
} from "./chain";
import { createKeyboardToAction } from "./create";
import { isGameAction } from "./guards";

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

const runChainStep = (
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

const cleanupChainStep = (keyboardChain: KeyboardToActionChain): void => {
  if (!keyboardChain) {
    return;
  }
  keyboardChain.commands[keyboardChain.step]?.cleanup?.();
};

const cancelChainStep = (
  keyboardChain: KeyboardToActionChain,
): KeyboardEventResult => {
  if (!keyboardChain) {
    throw new Error(
      "Can't cancel keyboard chain step in non-existent keyboard chain",
    );
  }
  cleanupChainStep(keyboardChain);

  if (keyboardChain.step > 0) {
    const previousStep = keyboardChain.step - 1;
    const previousMessage = keyboardChain.commands[previousStep]?.message;
    const result = runChainStep(keyboardChain, previousStep);

    return {
      action: getInternalLogAction(
        previousMessage ? ["Step canceled", previousMessage] : "Step canceled",
      ),
      keyboardChain: result.keyboardChain,
    };
  }

  return {
    action: getInternalLogAction("Action canceled"),
    keyboardChain: undefined,
  };
};

const handleInvalidKeyCode = (keyboardChain: KeyboardToActionChain) => {
  const fallback = getLastFallbackMessage(keyboardChain);

  if (fallback !== undefined) {
    return {
      action: getInternalLogAction(fallback),
      keyboardChain,
    };
  }

  return { action: undefined, keyboardChain };
};

const hasActiveChain = (
  keyboardChain: KeyboardToActionChain,
): keyboardChain is ActiveKeyboardToActionChain => {
  return keyboardChain !== undefined && keyboardChain !== null;
};

const handleNoOpAction = (nextKeyboardChain: KeyboardToActionChain) => {
  if (!nextKeyboardChain) {
    return { action: undefined, keyboardChain: undefined };
  }

  const nextStep = nextKeyboardChain.step + 1;
  const nextCommand = nextKeyboardChain.commands[nextStep];

  if (!nextCommand) {
    throw new Error("The last keyboard chain step must return a GameAction");
  }

  return runChainStep(nextKeyboardChain, nextStep);
};

const getRootCommands = (
  event: KeyboardEvent,
  keyboardChain: KeyboardToActionChain,
) => {
  const root = createKeyboardToAction();
  const commands = keyboardChain?.current ?? root;
  return commands[event.code];
};
export const mapKeyboardEventToAction = (
  event: KeyboardEvent,
  keyboardChain: KeyboardToActionChain,
): KeyboardEventResult => {
  if (event.code === "Escape" && keyboardChain) {
    return cancelChainStep(keyboardChain);
  }

  const rootCommands = getRootCommands(event, keyboardChain);

  if (!rootCommands) {
    return handleInvalidKeyCode(keyboardChain);
  }

  const nextCommands = resolveCommandChain(rootCommands);

  const nextKeyboardChain: KeyboardToActionChain = keyboardChain ?? {
    current: {},
    commands: nextCommands,
    step: 0,
    history: [],
  };

  const command = hasActiveChain(keyboardChain)
    ? resolveCommand(rootCommands)
    : nextCommands[0];

  if (isGameAction(command.action)) {
    return { action: command.action, keyboardChain: undefined };
  }

  const result = command.action();

  if (result === undefined) {
    return handleNoOpAction(nextKeyboardChain);
  }

  if (isGameAction(result)) {
    return { action: result, keyboardChain: undefined };
  }

  // Advance chain
  nextKeyboardChain.current = result;
  nextKeyboardChain.history.push(command);
  return {
    action: command.message ? getInternalLogAction(command.message) : undefined,
    keyboardChain: nextKeyboardChain,
  };
};
