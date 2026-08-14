import { GAME_STATUS, STATE } from "../../state/state";
import { WorldActionType } from "../world/types";

export const isPendingGameOver = () =>
  STATE.status === GAME_STATUS.PENDING_GAME_OVER;
export const isGameOver = () => STATE.status === GAME_STATUS.GAME_OVER;
export const getPendingGameOverAction = () => {
  return {
    type: WorldActionType.PENDING_GAME_OVER,
  };
};
export const getGameOverAction = () => {
  return {
    type: WorldActionType.GAME_OVER,
  };
};
