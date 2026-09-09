import { getHp } from "../hp/hp";
import { getPlayer } from "../player/player";
import { GAME_STATUS, STATE } from "../../state/state";

export const shouldEndGame = () =>
  STATE.status === GAME_STATUS.ACTIVE && getHp(getPlayer()).hp <= 0;
