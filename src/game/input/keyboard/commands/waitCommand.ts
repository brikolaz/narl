import {
  PlayerActionType,
  type PlayerWaitAction,
} from "../../../systems/player/types";
import type { KeyboardToActionCommand } from "../chain";

export const getWaitCommand = (): KeyboardToActionCommand => {
  const action: PlayerWaitAction = {
    type: PlayerActionType.WAIT,
  };

  return { action };
};
