import { PlayerActionType, type PlayerMoveAction } from "../../../systems/player/types";
import { Direction } from "../../../systems/turn/types";
import type { KeyboardToActionCommand } from "../chain";

export const getMoveCommand = (
  direction: Direction,
): KeyboardToActionCommand => {
  const action: PlayerMoveAction = {
    type: PlayerActionType.MOVE,
    direction,
  };

  return {
    action,
  };
};
