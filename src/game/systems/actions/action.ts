import { createLogMessage } from "../log/createLogMessage"
import type { MessageKey } from "../../i18n/types"
import { STATE } from "../../state/state"
import { assert } from "../../../utils/assert"
import type { LogMessage, LogReplacement } from "../log/types"
import { getPendingLogs } from "../log/log"
import type { TimedAction } from "./timedActions/types"
import type { ActionResolution, GameAction } from "./types"

export class Action {
  private results: { message?: LogMessage; increaseTurn: boolean }[] = []

  get consumesTurn(): boolean {
    return this.results.some(({ increaseTurn }) => increaseTurn)
  }
  private pendingActions: TimedAction[] = []

  public readonly gameAction: GameAction

  constructor(gameAction: GameAction) {
    this.gameAction = gameAction
  }

  fail = (key: MessageKey, ...replacements: LogReplacement[]): void => {
    this.results.push({
      message: createLogMessage(key, replacements),
      increaseTurn: false,
    })
  }

  success = (key?: MessageKey, ...replacements: LogReplacement[]): void => {
    this.results.push({
      message:
        key === undefined ? undefined : createLogMessage(key, replacements),
      increaseTurn: true,
    })
  }

  resolve = (consumesTurn?: boolean): ActionResolution => {
    return {
      consumesTurn: consumesTurn ?? this.consumesTurn,
      pendingLogs: getPendingLogs(
        this.gameAction,
        this.results.flatMap(({ message }) => (message ? [message] : [])),
      ),
      pendingActions: this.pendingActions,
      action: this,
    }
  }

  addPendingDelayedAction = (
    action: GameAction,
    delay: number = 1,
    duration: number = 1,
    priority: number = 0,
  ): void => {
    assert(duration >= 1, "Pending action must last least 1 turn")
    assert(
      delay > 0,
      "Pending delayed action delay must be greater than 0 turns",
    )

    this.pendingActions.push({
      id: STATE.getId(),
      action,
      duration: duration - 1,
      delay,
      priority,
    })
  }

  addPendingImmediateAction = (
    action: GameAction,
    duration: number = 1,
    priority: number = 0,
  ): void => {
    assert(duration >= 1, "Pending action must last at least 1 turn")

    this.pendingActions.push({
      id: STATE.getId(),
      action,
      duration: duration - 1,
      delay: 0,
      priority,
    })
  }

  info(key: MessageKey, ...replacements: LogReplacement[]): void {
    this.results.push({
      message: createLogMessage(key, replacements),
      increaseTurn: false,
    })
  }
}
