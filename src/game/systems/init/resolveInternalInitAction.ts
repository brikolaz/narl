import { removeEntity } from "../../../core/ecs/queries/entities/remove";
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
    throw new Error("Can't reinitialize the game");
  }

  validateSpawnTables();

  (() => {
    const oldPlayer = STATE.player.player;

    STATE.world = initWorld();
    STATE.turn = INITIAL_TURN;
    STATE.log = [];
    STATE.actionLog = [];
    STATE.initialized = true;
    STATE.player = initPlayer();

    removeEntity(oldPlayer);

    action.info("You'd rather stay dead");
  })();

  return action.resolve();
};
