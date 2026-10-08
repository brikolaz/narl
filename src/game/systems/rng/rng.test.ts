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
import { createPrng } from "./rng"

describe("rng", () => {
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

  it("produces the same sequence for the same seed", () => {
    const first = createPrng("repeatable-seed")
    const second = createPrng("repeatable-seed")

    const firstSequence = Array.from({ length: 10_000 }, first)
    const secondSequence = Array.from({ length: 10_000 }, second)

    expect(firstSequence).toEqual(secondSequence)
  })

  it("matches the golden sequence for a known seed", () => {
    const random = createPrng("golden-seed")

    expect(Array.from({ length: 32 }, random)).toEqual([
      0.47667959332466125, 0.4362147196661681, 0.8519550948403776,
      0.9464684179984033, 0.5801304783672094, 0.3009343098383397,
      0.7968726153485477, 0.01865171338431537, 0.16069010575301945,
      0.7257603083271533, 0.7652804781682789, 0.3307221399154514,
      0.5702673522755504, 0.6969027232844383, 0.23972642119042575,
      0.8236076098401099, 0.3266922519542277, 0.7385470394510776,
      0.6279185151215643, 0.11559136281721294, 0.7154486968647689,
      0.048636378487572074, 0.19639817322604358, 0.1304061107803136,
      0.9152204545680434, 0.867188174976036, 0.515015198616311,
      0.11502311495132744, 0.8274232009425759, 0.08088669017888606,
      0.6404314544051886, 0.7604097621515393,
    ])
  })

  it("produces values normalized to the unit interval", () => {
    const first = createPrng("first-seed")

    const firstSequence = Array.from({ length: 100 }, first)

    expect(firstSequence.every((value) => value >= 0 && value < 1)).toBe(true)
  })

  it("produces a distinct sequence for a different seed", () => {
    const first = createPrng("first-seed")
    const second = createPrng("second-seed")

    const firstSequence = Array.from({ length: 100 }, first)
    const secondSequence = Array.from({ length: 100 }, second)

    expect(firstSequence).not.toEqual(secondSequence)
  })
})
