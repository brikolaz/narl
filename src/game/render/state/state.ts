import type { EqSlot } from "./eq";

type BaseUiState = {
  highlights: {
    eqSlot: EqSlot | undefined;
  };
};
type DefaultUiState = {
  defaults: BaseUiState;
};
export type UiState = BaseUiState & DefaultUiState;

const getInitialUiState = (): UiState => {
  return {
    defaults: {
      highlights: {
        eqSlot: undefined,
      },
    },
    highlights: {
      eqSlot: undefined,
    },
  };
};

export const UI_STATE: UiState = getInitialUiState();
