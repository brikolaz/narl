import type { GameState } from "../../state/state";
import { getPendingLogs } from "../log/log";
import type { ActionResolution, GameAction } from "./types";

export class Action {
  public consumesTurn = false;
  private pendingLogMessages: string[] = []; // TODO: add log object: message, increaseTurn
  private pendingActions: GameAction[] = [];
  private gameAction: GameAction;

  constructor(gameAction:GameAction) {
    this.gameAction = gameAction;
  }

  fail = (message: string): void => {
    this.pendingLogMessages.push(message);
  };

  success = (message: string): void => {
    this.pendingLogMessages.push(message);
    this.consumesTurn = true;
  };

  resolve = (
    nextState: GameState,
    consumesTurn?: boolean,
  ): ActionResolution => {
    return {
      nextState,
      consumesTurn: consumesTurn ?? this.consumesTurn,
      pendingLogs: getPendingLogs(this.gameAction, this.pendingLogMessages),
      pendingActions: this.pendingActions,
      action: this,
    };
  };

  addPending = (...pendingAction: GameAction[]): void => {
    this.pendingActions.push(...pendingAction);
  };

  info(message: string) {
    this.pendingLogMessages.push(message);
  }
}
