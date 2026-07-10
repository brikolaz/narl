import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import type { PlayerCurseItemAction } from "../player/types";

// TODO: use instead of curse() function if
// domain uses entity registry
export const resolvePlayerCurseItemAction = (
  state: GameState,
  gameAction: PlayerCurseItemAction,
): ActionResolution => {
  const action: Action = new Action(gameAction);
  (() => {})();

  return action.resolve(state);
};
