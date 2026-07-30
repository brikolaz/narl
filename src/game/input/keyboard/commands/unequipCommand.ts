import { getAdjacentEqSlots } from "../../../render/render";
import type { EqSlot } from "../../../render/state/eq";
import {
  getHighlightedEqSlot,
  highlightEqSlot,
  resetHighlightedEqSlot,
} from "../../../render/state/highlights";
import { PlayerActionType } from "../../../systems/player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";

// TODO: create generic function to handle EQ/BP
const getTargetSlotCommand = (): KeyboardToAction => {
  const highlighted = getHighlightedEqSlot() ?? highlightEqSlot();
  const { left, right, up, down } = getAdjacentEqSlots(highlighted);

  const move = (slot: EqSlot) => {
    highlightEqSlot(slot);
    return getTargetSlotCommand();
  };

  return {
    Space: {
      action: () => {
        resetHighlightedEqSlot();

        return {
          type: PlayerActionType.UNEQUIP_ITEM,
          eqSlot: highlighted,
        };
      },
    },

    ...(left && {
      ArrowLeft: {
        next: () => move(left),
        fallback: "Invalid direction",
      },
    }),

    ...(right && {
      ArrowRight: {
        next: () => move(right),
        fallback: "Invalid direction",
      },
    }),

    ...(up && {
      ArrowUp: {
        next: () => move(up),
        fallback: "Invalid direction",
      },
    }),

    ...(down && {
      ArrowDown: {
        next: () => move(down),
        fallback: "Invalid direction",
      },
    }),
  };
};

export const getUnequipCommand = (): KeyboardToActionCommand => {
  return {
    next: () => getTargetSlotCommand(),
    message: `Select EQ slot to unequip (arrow keys, space to confirm)`,
    fallback: "Invalid direction",
  };
};
