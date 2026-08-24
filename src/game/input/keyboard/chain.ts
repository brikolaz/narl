import type { GameAction } from "../../systems/actions/types";

export type KeyboardToActionCommand = {
  action: GameAction | (() => GameAction | void | KeyboardToAction);
  fallback?: string;
  message?: string;
  cleanup?: () => void;
};

export type KeyboardToAction = Record<
  string,
  KeyboardToActionCommand | KeyboardToActionCommand[]
>;

export type KeyboardToActionChain =
  | {
      current: KeyboardToAction;
      history: KeyboardToActionCommand[];
      commands: KeyboardToActionCommand[];
      step: number;
    }
  | undefined;

export type KeyboardEventResult = {
  action: GameAction | undefined;
  keyboardChain: KeyboardToActionChain;
};

export type ActiveKeyboardToActionChain = NonNullable<KeyboardToActionChain>;

export const getLastFallbackMessage = (
  keyboardChain: KeyboardToActionChain,
): string | undefined => {
  const last = keyboardChain?.history?.at(-1)?.fallback;
  return last;
};
