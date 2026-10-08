import { NAMESPACE_SEPARATOR } from "../../../utils/constants"
import { createPrng } from "./rng"

export type RandomContext = {
  namespace: string
  seed: string
}

const getRandomContextNamespace = (namespaces: string[]): string =>
  namespaces.join(NAMESPACE_SEPARATOR)

export class Random {
  private static readonly randomTotalChance = 100 as const
  private readonly namedChances = new Map<string, boolean>()

  private readonly context: RandomContext
  private rolls = 0

  rng: () => number

  constructor(context: RandomContext) {
    this.context = context
    this.rng = createPrng(
      getRandomContextNamespace([this.context.seed, this.context.namespace]),
    )
  }

  resetNamedChances(): void {
    this.namedChances.clear()
  }

  random(): number {
    this.rolls++
    return this.rng()
  }

  chance(percent: number): boolean {
    return this.random() * Random.randomTotalChance < percent
  }

  namedChance(percent: number, name: string): boolean {
    const key = getRandomContextNamespace([this.context.seed, name])

    const cached = this.namedChances.get(key)
    if (cached !== undefined) return cached

    const result = this.chance(percent)
    this.namedChances.set(key, result)

    return result
  }

  range(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min
  }

  pick<Item>(...items: readonly Item[]): Item | undefined {
    if (items.length === 0) {
      return undefined
    }

    return items[this.range(0, items.length - 1)]
  }

  roll(): number {
    return this.range(1, 100)
  }
}
