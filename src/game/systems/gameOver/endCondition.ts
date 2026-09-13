import { getHp } from "../hp/hp"
import { getPlayer } from "../player/player"
import { GameStatusEnum, STATE } from "../../state/state"

export const shouldEndGame = () =>
  STATE.status === GameStatusEnum.ACTIVE && getHp(getPlayer()).hp <= 0
