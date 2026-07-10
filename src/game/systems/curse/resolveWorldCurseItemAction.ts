import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { WorldCurseItemAction } from "../world/types";

export const resolveCurseItemAction = (
  state: GameState,
  gameAction: WorldCurseItemAction,
): ActionResolution => {
  const action: Action = new Action(gameAction);

  (() => {})();

  return action.resolve(state);
};
