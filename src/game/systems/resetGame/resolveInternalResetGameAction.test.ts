import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createGame, type Game } from "../../../game"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import { GameStatusEnum } from "../../state/state"
import { InternalActionTypeEnum } from "../internal/types"
import * as seed from "../rng/seed"
import { WorldActionTypeEnum } from "../world/types"

describe("resolveInternalResetGameAction", () => {
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

  it("generates the initial seed once when creating a game", () => {
    const generateSeed = vi
      .spyOn(seed, "generateSeed")
      .mockReturnValue("initial-seed")

    createGame()

    expect(generateSeed).toHaveBeenCalledOnce()
    expect(game.state.seed).toBe("initial-seed")
  })

  describe("starts a new game with a new seed", () => {
    it("with GAME_OVER status", () => {
      vi.spyOn(seed, "generateSeed").mockReturnValue("new-seed")

      game.dispatch({ type: InternalActionTypeEnum.INTERNAL_INIT })
      game.dispatch({ type: WorldActionTypeEnum.WORLD_PENDING_GAME_OVER })
      game.dispatch({ type: WorldActionTypeEnum.WORLD_GAME_OVER })
      game.dispatch()

      expect(game.state.status).toBe(GameStatusEnum.ACTIVE)
      expect(seed.generateSeed).toHaveBeenCalledOnce()
      expect(game.state.seed).toBe("new-seed")
    })

    it("with WIN status", () => {
      vi.spyOn(seed, "generateSeed").mockReturnValue("new-seed")

      game.dispatch({ type: WorldActionTypeEnum.WORLD_WIN })
      game.dispatch()

      expect(game.state.status).toBe(GameStatusEnum.ACTIVE)
      expect(seed.generateSeed).toHaveBeenCalledOnce()
      expect(game.state.seed).toBe("new-seed")
    })
  })

  describe("rejects reset", () => {
    it("while game is INACTIVE", () => {
      expect(game.state.status).toBe(GameStatusEnum.INACTIVE)
      expect(() =>
        game.dispatch({ type: InternalActionTypeEnum.INTERNAL_RESET_GAME }),
      ).toThrow("Can't reset an active game")
    })

    it("while game is ACTIVE", () => {
      game.dispatch({ type: InternalActionTypeEnum.INTERNAL_INIT })

      expect(game.state.status).toBe(GameStatusEnum.ACTIVE)
      expect(() =>
        game.dispatch({ type: InternalActionTypeEnum.INTERNAL_RESET_GAME }),
      ).toThrow("Can't reset an active game")
    })
  })
})
