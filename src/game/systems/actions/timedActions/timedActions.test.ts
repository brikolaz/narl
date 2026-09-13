import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createGame, type Game } from "../../../../game"
import { clearItems, clearMobs } from "../../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../../tests/integrity"
import { STATE } from "../../../state/state"
import { Action } from "../action"
import { InternalActionTypeEnum } from "../../internal/types"
import { applyTimedAction, dequeueTimedActions } from "./timedActions"

describe("applyTimedAction", () => {
  let game: Game

  beforeEach(() => {
    game = createGame()
    game.dispatch({ type: InternalActionTypeEnum.INTERNAL_INIT })
    clearMobs(game)
    clearItems(game)
  })

  afterEach(() => {
    if (isIntegrityCheckEnabled()) {
      expectGameStateConsistent(game)
    }

    vi.restoreAllMocks()
  })

  const getImmediateAction = (duration: number, priority?: number) => {
    const action = new Action({
      type: InternalActionTypeEnum.INTERNAL_LOG,
      message: "source",
    })
    action.addPendingImmediateAction(
      { type: InternalActionTypeEnum.INTERNAL_LOG, message: "tick" },
      duration,
      priority,
    )
    return action.resolve().pendingActions[0]
  }

  const getDelayedAction = (priority: number) => {
    const action = new Action({
      type: InternalActionTypeEnum.INTERNAL_LOG,
      message: "source",
    })
    action.addPendingDelayedAction(
      { type: InternalActionTypeEnum.INTERNAL_LOG, message: `${priority}` },
      1,
      1,
      priority,
    )
    return action.resolve().pendingActions[0]
  }

  it("queues the remaining execution when duration is two", () => {
    applyTimedAction(getImmediateAction(2))

    expect(STATE.timedActions).toHaveLength(1)
    expect(STATE.timedActions[0]?.duration).toBe(0)
  })

  it("does not queue another execution when duration is one", () => {
    applyTimedAction(getImmediateAction(1))

    expect(STATE.timedActions).toHaveLength(0)
  })

  it("assigns zero priority by default", () => {
    expect(getImmediateAction(1)?.priority).toBe(0)
  })

  it("dequeues timed actions from highest to lowest priority", () => {
    for (const priority of [0, 10, -5, 10]) {
      applyTimedAction(getDelayedAction(priority))
    }

    expect(dequeueTimedActions().map(({ priority }) => priority)).toEqual([
      10, 10, 0, -5,
    ])
  })
})
