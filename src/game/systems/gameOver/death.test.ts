import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { patchComponentByType } from "../../../core/model/queries/components/patch"
import { createGame, type Game } from "../../../game"
import { clearItems, clearMobs } from "../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import { HpComponent } from "../../model/components/combat/HpComponent"
import { getPlayer } from "../player/player"
import { InternalActionTypeEnum } from "../internal/types"
import { recordDeathTurn } from "./death"

describe("recordDeathTurn", () => {
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

  it.each([
    { consumesTurn: true, expectedTurn: 18 },
    { consumesTurn: false, expectedTurn: 17 },
  ])(
    "records turn $expectedTurn when consumesTurn is $consumesTurn",
    ({ consumesTurn, expectedTurn }) => {
      game.state.turn = 17
      patchComponentByType(getPlayer(), HpComponent, (hpComponent) => {
        hpComponent.hp = 0
      })

      recordDeathTurn(consumesTurn)

      expect(game.state.death.turn).toBe(expectedTurn)
    },
  )
})
