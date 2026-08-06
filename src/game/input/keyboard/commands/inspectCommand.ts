import { UI_STATE } from "../../../render/state/state";
import type { EqSlot, InvSlot } from "../../../render/state/types";
import { PlayerActionType } from "../../../systems/player/types";
import type { KeyboardToAction, KeyboardToActionCommand } from "../chain";
import { EQ_SLOTS, getAdjacentSlotActions, INV_SLOTS } from "./slots";

const resetHighlights = () => {
  UI_STATE.highlights.invSlot.resetHighlightedSlot();
  UI_STATE.highlights.eqSlot.resetHighlightedSlot();
};

const getInvCommands = (): KeyboardToAction => ({
  ...getAdjacentSlotActions(
    (invSlot: InvSlot) => ({
      type: PlayerActionType.INSPECT_INV,
      invSlot,
    }),
    UI_STATE.highlights.invSlot,
    INV_SLOTS,
    {
      Tab: {
        action: () => {
          UI_STATE.highlights.invSlot.resetHighlightedSlot();
          return getEqCommands();
        },
        message: "Inspect context: EQ",
        fallback: "Invalid direction",
      },
    },
  ),
});

const getEqCommands = (): KeyboardToAction => ({
  ...getAdjacentSlotActions(
    (eqSlot: EqSlot) => ({
      type: PlayerActionType.INSPECT_EQ,
      eqSlot,
    }),
    UI_STATE.highlights.eqSlot,
    EQ_SLOTS,
    {
      Tab: {
        action: () => {
          UI_STATE.highlights.eqSlot.resetHighlightedSlot();
          return getInvCommands();
        },
        message: "Inspect context: INV",
        fallback: "Invalid direction",
      },
    },
  ),
});

export const getInspectCommand = (): KeyboardToActionCommand => ({
  action: () => getInvCommands(),
  message: "Inspect INV item (arrows to move, Tab for EQ, space to confirm)",
  fallback: "Invalid direction",
  cleanup: resetHighlights,
});
