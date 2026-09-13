/// <reference types="node" />

import process from "node:process"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createGame, type Game } from "../game"
import { InternalActionTypeEnum } from "../game/systems/internal/types"
import { expectGameStateConsistent, isIntegrityCheckEnabled } from "./integrity"
import { clearItems, clearMobs } from "./clear"
import { assert } from "../utils/assert"

const originalTestIntegrity = process.env.TEST_INTEGRITY

describe("integrity test helpers", () => {
  let game: Game

  beforeEach(() => {
    game = createGame()
    game.dispatch({ type: InternalActionTypeEnum.INTERNAL_INIT })
    clearMobs(game)
    clearItems(game)
  })

  afterEach(() => {
    if (originalTestIntegrity === undefined) {
      delete process.env.TEST_INTEGRITY
    } else {
      process.env.TEST_INTEGRITY = originalTestIntegrity
    }

    if (isIntegrityCheckEnabled()) {
      expectGameStateConsistent(game)
    }

    vi.restoreAllMocks()
  })

  describe("isIntegrityCheckEnabled", () => {
    it("returns false when TEST_INTEGRITY is not set", () => {
      delete process.env.TEST_INTEGRITY

      expect(isIntegrityCheckEnabled()).toBe(false)
    })

    it("returns true when TEST_INTEGRITY is 1", () => {
      process.env.TEST_INTEGRITY = "1"

      expect(isIntegrityCheckEnabled()).toBe(true)
    })

    it.each(["0", "true"])(
      "returns false when TEST_INTEGRITY is %s",
      (value) => {
        process.env.TEST_INTEGRITY = value

        expect(isIntegrityCheckEnabled()).toBe(false)
      },
    )
  })

  describe("expectGameStateConsistent", () => {
    it("checks game state integrity when called", () => {
      expect(() => expectGameStateConsistent(game)).not.toThrow()
    })

    it("throws when entity state is inconsistent", () => {
      const record = assert(
        Object.values(game.state.entityRegistryById)[0],
        "Expected an initialized entity registry",
      )

      game.state.entityRegistryById[-1] = record

      expect(() => expectGameStateConsistent(game)).toThrow()

      delete game.state.entityRegistryById[-1]
    })
  })
})
