import { PlayerActionType, type PlayerMoveAction } from "../../../player/types";
import { Direction } from "../../../turn/types";
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
