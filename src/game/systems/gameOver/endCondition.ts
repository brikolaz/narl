import { getHp } from "../../model/queries/hp";
import { getPlayer } from "../../model/queries/player";
import { GAME_STATUS, STATE } from "../../state/state";

export const shouldEndGame = () =>
  STATE.status === GAME_STATUS.ACTIVE && getHp(getPlayer()).hp <= 0;
