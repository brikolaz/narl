import type { GameState } from "../../state/state";
import type { ActionResolution, GameAction } from "./types";

export type PendingLog = string;

export class Action {
  public consumesTurn = false;
  private pendingLogs: PendingLog[] = []; // TODO: add log object: message, increaseTurn
  private pendingActions: GameAction[] = [];

  fail = (message: string): void => {
    this.pendingLogs.push(message);
  };

  success = (message: string): void => {
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
      pendingLogs: this.pendingLogs,
      pendingActions: this.pendingActions,
      action: this,
    };
  };

  addPending = (...pendingAction: GameAction[]): void => {
    this.pendingActions.push(...pendingAction);
  };

  info(message: string) {
    this.pendingLogs.push(message);
  }
}
