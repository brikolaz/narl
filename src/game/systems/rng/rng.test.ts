import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createGame, type Game } from "../../../game"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import { MOBS_RNG_NAMESPACE } from "../../../utils/constants"
import { STATE } from "../../state/state"
import { InternalActionTypeEnum } from "../internal/types"
import { Random } from "./random"

describe("world RNG", () => {
  let game: Game

  beforeEach(() => {
    game = createGame()
  })

  afterEach(() => {
    if (isIntegrityCheckEnabled()) {
      expectGameStateConsistent(game)
    }

    vi.restoreAllMocks()
  })

  it("uses and preserves the seed known before game initialization", () => {
    const initialSeed = STATE.seed
    const expected = new Random({
      seed: initialSeed,
      namespace: MOBS_RNG_NAMESPACE,
    })

    game.dispatch({ type: InternalActionTypeEnum.INTERNAL_INIT })

    expect(STATE.seed).toBe(initialSeed)
    expect(STATE.rng.mobs.random()).toBe(expected.random())
  })
})
