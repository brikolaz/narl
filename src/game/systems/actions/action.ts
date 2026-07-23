import { STATE } from "../../state/state";
import type { Effect, TimedEffect } from "../effects/types";
import { getPendingLogs } from "../log/log";
import type { ActionResolution, GameAction } from "./types";

export class Action {
  public consumesTurn = false;
  private pendingLogMessages: string[] = []; // TODO: add log object: message, increaseTurn
  private pendingActions: GameAction[] = [];
  private pendingEffects: TimedEffect[] = [];
  public readonly gameAction: GameAction;

  constructor(gameAction: GameAction) {
    this.gameAction = gameAction;
  }

  fail = (message: string): void => {
    this.pendingLogMessages.push(message);
  };

  success = (message: string): void => {
    this.pendingLogMessages.push(message);
    this.consumesTurn = true;
  };

  resolve = (consumesTurn?: boolean): ActionResolution => {
    return {
      consumesTurn: consumesTurn ?? this.consumesTurn,
      pendingLogs: getPendingLogs(this.gameAction, this.pendingLogMessages),
      pendingActions: this.pendingActions,
      pendingEffects: this.pendingEffects,
      action: this,
    };
  };

  addPendingActions = (...pendingAction: GameAction[]): void => {
    this.pendingActions.push(...pendingAction);
  };

  addPendingEffect = (
    effect: Effect,
    immediate: boolean = true,
    turns: number = 1,
  ): void => {
    this.assert(turns >= 1, "Effects must have at least 1 turn");

    this.pendingEffects.push({
      id: STATE.getId(),
      action: this.gameAction,
      effect,
      immediate,
      turns: turns - 1,
    });
  };

  info(message: string) {
    this.pendingLogMessages.push(message);
  }

  assert<T>(value: T | null | undefined, message: string): T {
    if (value === null || value === undefined) {
      throw new Error(message);
    }

    return value;
  }

  assertCondition<T>(
    condition: T,
    message: string,
  ): asserts condition is NonNullable<T> {
    if (!condition) {
      throw new Error(message);
    }
  }
}
