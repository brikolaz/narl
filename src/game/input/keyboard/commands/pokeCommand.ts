import { getPlayer } from "../../../model/queries/player";
import { getPosition } from "../../../model/queries/position";
import {
    PlayerActionType
} from "../../../systems/player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";

const getPokeActionCommands = (): KeyboardToAction => {
  const playerPosition = getPosition(getPlayer());

  return {
    ArrowLeft: {
      action: {
        type: PlayerActionType.POKE,
        targetPosition: playerPosition - 1,
      },
    },
    ArrowRight: {
      action: {
        type: PlayerActionType.POKE,
        targetPosition: playerPosition + 1,
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
