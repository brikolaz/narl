import type { Entity } from "../../../core/model/Entity"
import type { Random } from "./random"
import { hashSeed } from "./seed"

export type Rng = Random

export const getRng = (entity: Entity) => {
  return entity.rng
}

const rotl = (x: number, k: number): number => (x << k) | (x >>> (32 - k))

// xoshiro128**
export const createPrng = (seed: string): (() => number) => {
  const state = new Uint32Array(hashSeed(seed))

  // xoshiro requires non-zero state
  if (state.every((value) => value === 0)) {
    state[0] = 1
  }

  return () => {
    const result = Math.imul(rotl(Math.imul(state[1], 5), 7), 9) >>> 0

    const t = state[1] << 9

    state[2] ^= state[0]
    state[3] ^= state[1]
    state[1] ^= state[2]
    state[0] ^= state[3]
    state[2] ^= t
    state[3] = rotl(state[3], 11)

    return result / 4294967296
  }
}
