import { afterEach, describe, expect, it, vi } from "vitest"
import { Random } from "./random"

const createRandom = (): Random =>
  new Random({ seed: "test-seed", namespace: "test" })

describe("random", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("picks an item from the array", () => {
    const random = createRandom()
    vi.spyOn(random, "random").mockReturnValue(0.5)

    expect(random.pick("first", "second", "third")).toBe("second")
  })

  it("returns undefined for an empty array without rolling", () => {
    const random = createRandom()
    const randomSpy = vi.spyOn(random, "random")

    expect(random.pick()).toBeUndefined()
    expect(randomSpy).not.toHaveBeenCalled()
  })

  it.each([
    [0.1, true],
    [0.9, false],
  ])(
    "reuses a cached %s named chance result without another roll",
    (roll, result) => {
      const first = createRandom()
      const firstRoll = vi.spyOn(first, "random").mockReturnValue(roll)

      expect(first.namedChance(50, "CURSE")).toBe(result)
      expect(first.namedChance(50, "CURSE")).toBe(result)
      expect(firstRoll).toHaveBeenCalledOnce()
    },
  )

  it("keeps named chance results separate for different names", () => {
    const first = createRandom()
    const firstRoll = vi
      .spyOn(first, "random")
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.9)

    expect(first.namedChance(50, "FIRST")).toBe(true)
    expect(first.namedChance(50, "SECOND")).toBe(false)
    expect(firstRoll).toHaveBeenCalledTimes(2)
  })

  it("keeps named chance results separate for instances with the same context", () => {
    const first = createRandom()
    const second = createRandom()
    const firstRoll = vi.spyOn(first, "random").mockReturnValue(0.1)
    const secondRoll = vi.spyOn(second, "random").mockReturnValue(0.9)

    expect(first.namedChance(50, "FIRST")).toBe(true)
    expect(second.namedChance(50, "FIRST")).toBe(false)
    expect(firstRoll).toHaveBeenCalledOnce()
    expect(secondRoll).toHaveBeenCalledOnce()
  })

  it("resets cached chances only for its instance", () => {
    const first = createRandom()
    const second = createRandom()
    const firstRoll = vi
      .spyOn(first, "random")
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.9)
    const secondRoll = vi.spyOn(second, "random").mockReturnValue(0.1)

    expect(first.namedChance(50, "CURSE")).toBe(true)
    expect(second.namedChance(50, "CURSE")).toBe(true)
    first.resetNamedChances()
    expect(first.namedChance(50, "CURSE")).toBe(false)
    expect(second.namedChance(50, "CURSE")).toBe(true)
    expect(firstRoll).toHaveBeenCalledTimes(2)
    expect(secondRoll).toHaveBeenCalledOnce()
  })
})
