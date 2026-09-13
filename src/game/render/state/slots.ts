import type { Highlight } from "./highlight"
import { UI_STATE } from "./state"

export type EqSlot = 1 | 2 | 3 | 4 | 5 | 6
export type InvSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type Slots<Slot extends number> = readonly (readonly (Slot | null)[])[]

type SlotDirection = "left" | "right" | "up" | "down"

export const EQ_SLOTS = [
  [null, 1, null],
  [2, 3, 4],
  [null, 5, null],
  [null, 6, null],
] as const satisfies Slots<EqSlot>

export const INV_SLOTS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
] as const satisfies Slots<InvSlot>

const LINK_SLOTS: Record<"inv" | "eq", (EqSlot | InvSlot)[]> = {
  inv: [1, 2, 3],
  eq: [6],
}

export const isInvLinkPoint = () => {
  const highlighted = UI_STATE.highlights.invSlot.getHighlightedSlot()
  if (highlighted === undefined) {
    return false
  }
  return LINK_SLOTS.inv.includes(highlighted)
}

export const isEqLinkPoint = () => {
  const highlighted = UI_STATE.highlights.eqSlot.getHighlightedSlot()
  if (highlighted === undefined) {
    return false
  }
  return LINK_SLOTS.eq.includes(highlighted)
}

export type AdjacentContainerSlots<Slot extends number> = Record<
  SlotDirection,
  Slot | undefined
>

export const getAdjacentSlots = <Slot extends number>(
  highlight: Highlight<Slot>,
  slots: Slots<Slot>,
): AdjacentContainerSlots<Slot> => {
  if (highlight.getHighlightedSlot() === undefined) {
    highlight.highlightSlot()
  }

  const highlightedSlot = highlight.getHighlightedSlot()

  let x = -1
  let y = -1

  for (let row = 0; row < slots.length; row++) {
    const column = slots[row].findIndex((slot) => slot === highlightedSlot)

    if (column !== -1) {
      x = column
      y = row
      break
    }
  }

  if (x === -1 || y === -1) {
    return {
      left: undefined,
      right: undefined,
      up: undefined,
      down: undefined,
    }
  }

  return {
    left: slots[y]?.[x - 1] ?? undefined,
    right: slots[y]?.[x + 1] ?? undefined,
    up: slots[y - 1]?.[x] ?? undefined,
    down: slots[y + 1]?.[x] ?? undefined,
  }
}
