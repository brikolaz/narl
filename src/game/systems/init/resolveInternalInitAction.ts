import { INITIAL_TURN } from "../../../utils/constants";
import { GAME_STATUS, initState, STATE, type GameStatus } from "../../state/state";
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

  if (
    !Array.from<GameStatus>([GAME_STATUS.INACTIVE, GAME_STATUS.GAME_OVER, GAME_STATUS.WIN]).includes(STATE.status)
  ) {
    throw new Error("Can't reinitialize the game");
  }

  validateSpawnTables();

  (() => {
    initState();

    STATE.world = initWorld();
    STATE.turn = INITIAL_TURN;
    STATE.log = [];
    STATE.actionLog = [];
    STATE.player = initPlayer();
    STATE.status = GAME_STATUS.ACTIVE;

    action.info("You'd rather stay dead");
  })();

  return action.resolve();
};
