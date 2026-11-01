import { GameStatusEnum, STATE } from "../../state"

export const isPendingGameOver = () =>
  STATE.status === GameStatusEnum.PENDING_GAME_OVER
export const isGameOver = () => STATE.status === GameStatusEnum.GAME_OVER
