const PRIMARY_BACKGROUND = "#630057"
const SECONDARY_BACKGROUND = "#005763"

export class Highlight<Slot extends number> {
  defaultSlot: Slot
  slot: Slot | undefined
  background = PRIMARY_BACKGROUND

  constructor(defaultSlot: Slot) {
    this.defaultSlot = defaultSlot
  }

  getHighlightedSlot = () => {
    return this.slot
  }

  getBackground = () => {
    return this.background
  }

  setCommandStage = (stage: number) => {
    this.background = stage > 1 ? SECONDARY_BACKGROUND : PRIMARY_BACKGROUND
  }

  highlightSlot = (slot?: Slot) => {
    this.slot = slot ?? this.defaultSlot
    return this.slot
  }

  resetHighlightedSlot = () => {
    this.slot = undefined
    this.background = PRIMARY_BACKGROUND
  }
}
