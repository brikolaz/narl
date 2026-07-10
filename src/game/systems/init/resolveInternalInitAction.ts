import { INITIAL_TURN } from "../../../utils/constants";
import type { GameState } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { type InternalInitAction } from "../internal/type";
import { validateSpawnTables } from "../rng/spawnTable";
import { initPlayer } from "./initPlayer";
import { initWorld } from "./initWorld";

export const resolveInternalInitAction = (
  state: GameState,
  gameAction: InternalInitAction,
): ActionResolution => {
  const action = new Action(gameAction);

  if (state.initialized) {
    return action.resolve(state);
  }

  validateSpawnTables();

  (() => {
    state.world = initWorld();
    state.turn = INITIAL_TURN;
    state.log = [];
    state.actionLog = [];
    state.initialized = true;
    state.player = initPlayer();
    action.info("You'd rather stay dead");
  })();

  return action.resolve(state);
};
