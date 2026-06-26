import seedrandom from "seedrandom";
import { NAMESPACE_SEPARATOR } from "../../../utils/constants";

export type RandomContext = {
  namespace: string;
  seed: string;
};

export const getRandomContextNamespace = (namespaces: string[]): string => {
  return namespaces.join(NAMESPACE_SEPARATOR);
};

export class Random {
  private static readonly RANDOM_TOTAL_CHANCE = 100 as const;
  rng: () => number;

  constructor(private readonly context: RandomContext) {
    this.rng = seedrandom(
      getRandomContextNamespace([this.context.seed, this.context.namespace]),
    );
  }

  random(): number {
    return this.rng();
  }

  chance(percent: number): boolean {
    return this.random() * Random.RANDOM_TOTAL_CHANCE <= percent;
  }

  range(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  roll(): number {
    return this.range(1, 100);
  }
}
