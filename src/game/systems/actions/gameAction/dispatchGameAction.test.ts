import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createGame, type Game } from "../../../../game"
import { clearItems, clearMobs } from "../../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../../tests/integrity"
import { InternalActionTypeEnum } from "../../internal/types"
import { Action } from "../action"
import { drainResolution, type DrainContext } from "./dispatchGameAction"

describe("drainResolution", () => {
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

  it("drains pending actions from highest to lowest priority", () => {
    const action = new Action({
      type: InternalActionTypeEnum.INTERNAL_LOG,
      message: "source",
    })
    const pendingActions = [
      { message: "low", priority: -5 },
      { message: "high first", priority: 10 },
      { message: "default", priority: 0 },
      { message: "high second", priority: 10 },
    ]

    for (const { message, priority } of pendingActions) {
      action.addPendingImmediateAction(
        { type: InternalActionTypeEnum.INTERNAL_LOG, message },
        1,
        priority,
      )
    }

    const context: DrainContext = {
      pendingLogs: [],
      processedActions: new Set(),
    }

    drainResolution(action.resolve(), context)

    expect(context.pendingLogs.map(({ message }) => message)).toEqual([
      "high first",
      "high second",
      "default",
      "low",
    ])
  })

  it("keeps priorities local to the current branch", () => {
    const action = new Action({
      type: InternalActionTypeEnum.INTERNAL_LOG,
      message: "parent",
    })
    action.addPendingImmediateAction(
      { type: InternalActionTypeEnum.INTERNAL_LOG, message: "sibling1" },
      1,
      10,
    )
    action.addPendingImmediateAction(
      { type: InternalActionTypeEnum.INTERNAL_LOG, message: "sibling2" },
      1,
      5,
    )
    const context: DrainContext = {
      pendingLogs: [],
      processedActions: new Set(),
    }

    drainResolution(action.resolve(), context)

    expect(context.pendingLogs.map(({ message }) => message)).toEqual([
      "sibling1",
      "sibling2",
    ])
  })
})
