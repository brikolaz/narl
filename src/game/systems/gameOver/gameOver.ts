import { GAME_STATUS, STATE } from "../../state/state";

export const isPendingGameOver = () =>
  STATE.status === GAME_STATUS.PENDING_GAME_OVER;
export const isGameOver = () => STATE.status === GAME_STATUS.GAME_OVER;