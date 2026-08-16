import { STATE } from "../../state/state";
import { assert } from "../../../utils/assert";
import { getPendingLogs } from "../log/log";
import type { TimedAction } from "./timedActions/types";
import type { ActionResolution, GameAction } from "./types";

export class Action {
  public consumesTurn = false;
  private pendingLogMessages: string[] = []; // TODO: add log object: message, increaseTurn
  private pendingActions: TimedAction[] = [];

  public readonly gameAction: GameAction;

  constructor(gameAction: GameAction) {
    this.gameAction = gameAction;
  }

  fail = (message: string): void => {
    this.pendingLogMessages.push(message);
  };

  success = (message?: string): void => {
    if (message) {
      this.pendingLogMessages.push(message);
    }
    this.consumesTurn = true;
  };

  resolve = (consumesTurn?: boolean): ActionResolution => {
    return {
      consumesTurn: consumesTurn ?? this.consumesTurn,
      pendingLogs: getPendingLogs(this.gameAction, this.pendingLogMessages),
      pendingActions: this.pendingActions,
      action: this,
    };
  };

  addPendingDelayedAction = (
    action: GameAction,
    delay: number = 1,
    duration: number = 1,
  ): void => {
    assert(duration >= 1, "Pending action must last least 1 turn");
    assert(
      delay > 0,
      "Pending delayed action delay must be greater than 0 turns",
    );

    this.pendingActions.push({
      id: STATE.getId(),
      action,
      duration: duration - 1,
      delay,
    });
  };

  addPendingImmediateAction = (
    action: GameAction,
    duration: number = 1,
  ): void => {
    assert(duration >= 1, "Pending action must last at least 1 turn");

    this.pendingActions.push({
      id: STATE.getId(),
      action,
      duration: duration - 1,
      delay: 0,
    });
  };

  info(message: string) {
    this.pendingLogMessages.push(message);
  }
}
