import { PlayerActionType } from "../../../systems/player/types";
import { Direction } from "../../../systems/turn/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";

const getAttackActionCommands = (): KeyboardToAction => {
  return {
    ArrowLeft: {
      action: {
        type: PlayerActionType.ATTACK,
        direction: Direction.LEFT,
      },
    },
    ArrowRight: {
      action: {
        type: PlayerActionType.ATTACK,
        direction: Direction.RIGHT,
      },
    },
  };
};

export const getAttackCommand = (): KeyboardToActionCommand => ({
  action: getAttackActionCommands,
  message: "Left/right? (arrow keys)",
  fallback: "Invalid direction",
});
