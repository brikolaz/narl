export class Highlight<Slot extends number> {
  defaultSlot: Slot
  slot: Slot | undefined

  constructor(defaultSlot: Slot) {
    this.defaultSlot = defaultSlot
  }

  getHighlightedSlot = () => {
    return this.slot
  }

  highlightSlot = (slot?: Slot) => {
    this.slot = slot ?? this.defaultSlot
    return this.slot
  }

  resetHighlightedSlot = () => {
    this.slot = undefined
  }
}
