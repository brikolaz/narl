import { INITIAL_TURN } from "../../../utils/constants";

export const isInitialTurn = (turn: number): boolean => {
  return turn === INITIAL_TURN;
};

export const increaseTurn = (turn: number): number => {
  return turn +1;
};
