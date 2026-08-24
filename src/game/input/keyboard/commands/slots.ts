import type { Highlight } from "../../../render/state/highlight";
import { getAdjacentSlots, type Slots } from "../../../render/state/slots";
import type { GameAction } from "../../../systems/actions/types";
import type { KeyboardToAction } from "../chain";

export const getAdjacentSlotActions = <T extends number>(
  action: (slot: T) => GameAction | KeyboardToAction | void,
  highlight: Highlight<T>,
  slots: Slots<T>,
  getRepeatedCommands: () => KeyboardToAction = () => ({}),
): KeyboardToAction => {
  const move = (slot: T) => {
    highlight.highlightSlot(slot);

    return getAdjacentSlotActions(
      action,
      highlight,
      slots,
      getRepeatedCommands,
    );
  };

  const { left, right, up, down } = getAdjacentSlots(highlight, slots);

  return {
    Space: {
      action: () => {
        const slot = highlight.getHighlightedSlot();

        if (slot === undefined) {
          return;
        }

        return action(slot);
      },
    },

    ...(left !== undefined && {
      ArrowLeft: {
        action: () => move(left),
        fallback: "Invalid direction",
      },
    }),

    ...(right !== undefined && {
      ArrowRight: {
        action: () => move(right),
        fallback: "Invalid direction",
      },
    }),

    ...(up !== undefined && {
      ArrowUp: {
        action: () => move(up),
        fallback: "Invalid direction",
      },
    }),

    ...(down !== undefined && {
      ArrowDown: {
        action: () => move(down),
        fallback: "Invalid direction",
      },
    }),

    ...getRepeatedCommands(),
  };
};
