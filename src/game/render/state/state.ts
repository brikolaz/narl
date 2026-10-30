import { Highlight } from "./highlight"
import type { EqSlot, InvSlot } from "./slots"

type MapOffset = -1 | 0 | 1

type BaseUiState = {
  highlights: {
    eqSlot: Highlight<EqSlot>
    invSlot: Highlight<InvSlot>
    map: Highlight<MapOffset>
  }
}
export type UiState = BaseUiState

const getInitialUiState = (): UiState => {
  return {
    highlights: {
      eqSlot: new Highlight<EqSlot>(3),
      invSlot: new Highlight<InvSlot>(5),
      map: new Highlight<MapOffset>(0),
    },
  }
}

export const UI_STATE: UiState = getInitialUiState()
