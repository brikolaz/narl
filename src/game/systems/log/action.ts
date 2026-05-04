import type { GameState } from "../../state/state";
import type { ActionResolution } from "../turn";
import { addLog } from "./addLog";

export class Action {
  public consumesTurn = false;
  private message = "";

  reject = (message: string): void => {
    this.message = message;
  };

  fulfill = (message: string): void => {
    this.message = message;
    this.consumesTurn = true;
  };

  resolve = (nextState: GameState): ActionResolution<GameState> => {
    return {
      nextState: addLog(nextState, this.message, this.consumesTurn),
      consumesTurn: this.consumesTurn,
    };
  };
}
