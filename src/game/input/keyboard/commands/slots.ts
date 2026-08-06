import type { Highlight } from "../../../render/state/highlight";
import type { EqSlot } from "../../../render/state/types";
import type { GameAction } from "../../../systems/actions/types";
import type { InvSlot } from "../../../systems/containers/types";
import type { KeyboardToAction } from "../chain";

type Slots<T extends number> = readonly (readonly (T | null)[])[];

type Direction = "left" | "right" | "up" | "down";

export const EQ_SLOTS = [
  [null, 1, null],
  [2, 3, 4],
  [null, 5, null],
  [null, 6, null],
] as const satisfies Slots<EqSlot>;

export const INV_SLOTS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
] as const satisfies Slots<InvSlot>;

export type AdjacentContainerSlots<T extends number> = Record<
  Direction,
  T | undefined
>;

export const getAdjacentSlots = <T extends number>(
  highlight: Highlight<T>,
  slots: Slots<T>,
): AdjacentContainerSlots<T> => {
  if (highlight.getHighlightedSlot() === undefined) {
    highlight.highlightSlot();
  }

  const highlightedSlot = highlight.getHighlightedSlot();

  let x = -1;
  let y = -1;

  for (let row = 0; row < slots.length; row++) {
    const column = slots[row].findIndex((slot) => slot === highlightedSlot);

    if (column !== -1) {
      x = column;
      y = row;
      break;
    }
  }

  if (x === -1 || y === -1) {
    return {
      left: undefined,
      right: undefined,
      up: undefined,
      down: undefined,
    };
  }

  return {
    left: slots[y]?.[x - 1] ?? undefined,
    right: slots[y]?.[x + 1] ?? undefined,
    up: slots[y - 1]?.[x] ?? undefined,
    down: slots[y + 1]?.[x] ?? undefined,
  };
};

export const getAdjacentSlotActions = <T extends number>(
  action: (slot: T) => GameAction | KeyboardToAction | void,
  highlight: Highlight<T>,
  slots: Slots<T>,
): KeyboardToAction => {
  const move = (slot: T) => {
    highlight.highlightSlot(slot);

    return getAdjacentSlotActions(action, highlight, slots);
  };

  const { left, right, up, down } = getAdjacentSlots(highlight, slots);

  return {
    Space: {
      action: () => {
        const slot = highlight.getHighlightedSlot();

        if (slot === undefined) {
          return;
        }

        highlight.resetHighlightedSlot();

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
  };
};
