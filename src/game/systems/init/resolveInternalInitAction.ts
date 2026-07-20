import { INITIAL_TURN } from "../../../utils/constants";
import { STATE } from "../../state/state";
import { Action } from "../actions/action";
import type { ActionResolution } from "../actions/types";
import { type InternalInitAction } from "../internal/type";
import { validateSpawnTables } from "../rng/spawnTable";
import { initPlayer } from "./initPlayer";
import { initWorld } from "./initWorld";

export const resolveInternalInitAction = (
  gameAction: InternalInitAction,
): ActionResolution => {
  const action = new Action(gameAction);

  if (STATE.initialized) {
    return action.resolve();
  }

  validateSpawnTables();

  (() => {
    STATE.world = initWorld();
    STATE.turn = INITIAL_TURN;
    STATE.log = [];
    STATE.actionLog = [];
    STATE.initialized = true;
    STATE.player = initPlayer();
    action.info("You'd rather stay dead");
  })();

  return action.resolve();
};
