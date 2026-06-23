import { PlayerActionType, type PlayerPickUpUnpackAction } from "../../../player/types";
import type { KeyboardToActionCommand } from "../chain";

export const getPickUpCommand = (
): KeyboardToActionCommand => {
  const action: PlayerPickUpUnpackAction = {
    type: PlayerActionType.PICK_UP_UNPACK,
  };

  return {
    action,
  };
};
