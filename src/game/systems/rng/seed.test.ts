import { afterEach, describe, expect, it, vi } from "vitest"
import { generateSeed, hashSeed } from "./seed"

const SEED_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

describe("seed", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("generates a ten-character seed from the unambiguous alphabet", () => {
    expect(generateSeed()).toMatch(new RegExp(`^[${SEED_ALPHABET}]{10}$`))
  })

  it.each([...SEED_ALPHABET].map((expected, value) => [value, expected]))(
    "maps five-bit value %i into the seed alphabet",
    (value, expected) => {
      vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
        const bytes = array as Uint8Array
        bytes.set([value, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        return array
      })

      expect(generateSeed()).toBe(`${expected}000000000`)
    },
  )

  it("hashes the same seed reproducibly into four unsigned words", () => {
    const hash = hashSeed("repeatable-seed")

    expect(hash).toEqual(hashSeed("repeatable-seed"))
    expect(hash).toHaveLength(4)
    expect(
      hash.every(
        (word) => Number.isInteger(word) && word >= 0 && word <= 0xffffffff,
      ),
    ).toBe(true)
  })

  it("produces a distinct state for a different seed", () => {
    expect(hashSeed("first-seed")).not.toEqual(hashSeed("second-seed"))
  })
})
