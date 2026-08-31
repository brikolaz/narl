import { INITIAL_TURN } from "../../../utils/constants";
import { GAME_STATUS, STATE } from "../../state/state";
import { validateSpawnTables } from "../rng/spawnTable";
import { initPlayer } from "./initPlayer";
import { initWorld } from "./initWorld";

export const initGame = (): void => {
  validateSpawnTables();
  STATE.world = initWorld();
  STATE.turn = INITIAL_TURN;
  STATE.log = [];
  STATE.actionLog = [];
  STATE.player = initPlayer();
  STATE.status = GAME_STATUS.ACTIVE;
};
