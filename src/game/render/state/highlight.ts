export class Highlight<T extends number> {
  defaultSlot: T;
  slot: T | undefined;

  constructor(defaultSlot: T) {
    this.defaultSlot = defaultSlot;
  }

  getHighlightedSlot = () => {
    return this.slot;
  };

  highlightSlot = (slot?: T) => {
    this.slot = slot ?? this.defaultSlot;
    return this.slot
  };

  resetHighlightedSlot = () => {
    this.slot = undefined;
  };
}
