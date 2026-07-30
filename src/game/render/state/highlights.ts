import type { EqSlot } from "./eq";
import { UI_STATE } from "./state";

export const getHighlightedEqSlot = () => {
  return UI_STATE.highlights.eqSlot;
};
export const highlightEqSlot = (slot: EqSlot = 3) => {
  UI_STATE.highlights.eqSlot = slot;
  return slot;
};
export const resetHighlightedEqSlot = () => {
  UI_STATE.highlights.eqSlot = UI_STATE.defaults.highlights.eqSlot;
};
