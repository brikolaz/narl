import { Highlight } from "./highlight";
import type { EqSlot, InvSlot } from "./types";

type BaseUiState = {
  highlights: {
    eqSlot: Highlight<EqSlot>;
    invSlot: Highlight<InvSlot>;
  };
};
export type UiState = BaseUiState;

const getInitialUiState = (): UiState => {
  return {
    highlights: {
      eqSlot: new Highlight<EqSlot>(3),
      invSlot: new Highlight<InvSlot>(5),
    },
  };
};

export const UI_STATE: UiState = getInitialUiState();
