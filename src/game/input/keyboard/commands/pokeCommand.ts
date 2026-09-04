import {
  PlayerActionType
} from "../../../systems/player/types";
import { Direction } from "../../../systems/turn/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";

const getPokeActionCommands = (): KeyboardToAction => {
  return {
    ArrowLeft: {
      action: {
        type: PlayerActionType.POKE,
        direction: Direction.LEFT,
      },
    },
    ArrowRight: {
      action: {
        type: PlayerActionType.POKE,
        direction: Direction.RIGHT

      },
    },
  };
};

export const getPokeCommand = (): KeyboardToActionCommand => {
  return {
    action: () => getPokeActionCommands(),
    message: `Left/right? (arrow keys)`,
    fallback: "Invalid direction",
  };
};
