import { STATE, type DeathContext } from "../../state/state";
import { shouldEndGame } from "./endCondition";

export const getDeathContext = (): DeathContext => {
  return STATE.death;
};

export const initDeath = (op: () => void) => {
  op();
  if (shouldEndGame()) {
    STATE.death.turn = STATE.turn;
  }
};
