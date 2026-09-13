import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createGame, type Game } from "../../../game"
import { clearItems, clearMobs } from "../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import { InternalActionTypeEnum } from "../internal/types"
import { flushLogs } from "./log"

const action = {
  type: InternalActionTypeEnum.INTERNAL_LOG,
  message: "Picked up Sword",
}

const flushPickupLog = () => {
  flushLogs([{ action, message: action.message }], true)
}

describe("flushLogs", () => {
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

  it("stacks identical messages from consecutive turns", () => {
    game.state.turn = 59
    flushPickupLog()

    game.state.turn = 60
    flushPickupLog()

    expect(
      game.state.log.filter(
        ({ action: logAction }) =>
          logAction.type === InternalActionTypeEnum.INTERNAL_LOG,
      ),
    ).toMatchObject([
      {
        message: "Picked up Sword",
        startTurn: 60,
        endTurn: 61,
        count: 2,
      },
    ])
  })

  it("keeps identical messages separate when turns occurred between them", () => {
    game.state.turn = 59
    flushPickupLog()

    game.state.turn = 63
    flushPickupLog()

    expect(
      game.state.log.filter(
        ({ action: logAction }) =>
          logAction.type === InternalActionTypeEnum.INTERNAL_LOG,
      ),
    ).toMatchObject([
      {
        message: "Picked up Sword",
        startTurn: 60,
        endTurn: 60,
        count: 1,
      },
      {
        message: "Picked up Sword",
        startTurn: 64,
        endTurn: 64,
        count: 1,
      },
    ])
  })
})
