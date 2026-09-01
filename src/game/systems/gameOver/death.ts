import { STATE, type DeathContext } from "../../state/state";
import { increaseTurn } from "../turn/turn";

export const getDeathContext = (): DeathContext => {
  return STATE.death;
};

export const initDeath = (op: () => void) => {
  op();
};

export const recordDeathTurn = (consumesTurn: boolean) => {
  STATE.death.turn = consumesTurn ? increaseTurn(STATE.turn) : STATE.turn;
};
