import type { GameState } from "../../state/state";
import type { ActionResolution, GameAction } from "../turn";
import { addLogImmutable } from "./log";

export class Action {
  public consumesTurn = false;
  private pendingLogs: string[] = [];
  private pendingActions: GameAction[] = [];

  reject = (message: string): void => {
    this.pendingLogs.push(message);
  };

  fulfill = (message: string): void => {
    this.pendingLogs.push(message);
    this.consumesTurn = true;
  };

  resolve = (
    nextState: GameState,
    consumesTurn?: boolean,
  ): ActionResolution => {
    return {
      nextState,
      consumesTurn: consumesTurn ?? this.consumesTurn,
      pendingActions: this.pendingActions,
      action: this,
    };
  };

  addPending = (...pendingAction: GameAction[]): void => {
    this.pendingActions.push(...pendingAction);
  };

  log(message: string) {
    this.pendingLogs.push(message);
  }

  flushLogs(state: GameState): GameState {
    return this.pendingLogs.reduce(
      (next, msg) => addLogImmutable(next, msg),
      state,
    );
  }
}
