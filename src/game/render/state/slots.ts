import type { Highlight } from "./highlight";
import { UI_STATE } from "./state";

export type EqSlot = 1 | 2 | 3 | 4 | 5 | 6;
export type InvSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Slots<T extends number> = readonly (readonly (T | null)[])[];

export type Direction = "left" | "right" | "up" | "down";

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

export const LINK_SLOTS: Record<"INV" | "EQ", (EqSlot | InvSlot)[]> = {
  INV: [1, 2, 3],
  EQ: [6],
};

export const isInvLinkPoint = () => {
  const highlighted = UI_STATE.highlights.invSlot.getHighlightedSlot();
  if (highlighted === undefined) {
    return false;
  }
  return LINK_SLOTS.INV.includes(highlighted);
};

export const isEqLinkPoint = () => {
  const highlighted = UI_STATE.highlights.eqSlot.getHighlightedSlot();
  if (highlighted === undefined) {
    return false;
  }
  return LINK_SLOTS.EQ.includes(highlighted);
};

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
