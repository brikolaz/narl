import { getPlayer } from "../../../systems/player/player";
import { Direction } from "../../../systems/turn/types";
import { WorldActionType } from "../../../systems/world/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";

const getPokeActionCommands = (): KeyboardToAction => {
  return {
    ArrowLeft: {
      action: {
        type: WorldActionType.POKE,
        sourceId: getPlayer().id,
        direction: Direction.LEFT,
      },
    },
    ArrowRight: {
      action: {
        type: WorldActionType.POKE,
        sourceId: getPlayer().id,
        direction: Direction.RIGHT,

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
