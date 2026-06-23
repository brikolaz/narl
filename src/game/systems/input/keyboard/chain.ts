import type { GameAction } from "../../actions/types";

export type KeyboardToActionCommand = {
  action?: GameAction;
  next?: () => KeyboardToAction;
  fallback?: string;
  message?: string;
};

export type KeyboardToAction = Record<string, KeyboardToActionCommand>;

export type KeyboardToActionChain =
  | {
      current: KeyboardToAction;
      history: KeyboardToActionCommand[];
    }
  | undefined;


export const getLastFallbackMessage = (
  keyboardChain: KeyboardToActionChain,
): string | undefined => {
  const last = keyboardChain?.history?.at(-1)?.fallback
  return last;
};