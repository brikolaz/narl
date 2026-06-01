import {
  DEFAULT_SEED,
  MOBS_NAMESPACE_SEPARATOR,
  NAMESPACE_SEPARATOR,
} from "../../../utils";
import seedrandom from "seedrandom";

export type RandomContext = {
  namespace: string;
  seed: string;
};

export const getRandomContextNamespace = (namespaces: string[]): string => {
  return namespaces.join(NAMESPACE_SEPARATOR);
};

export class Random {
  rng: () => number;

  constructor(private readonly context: RandomContext) {
    this.rng = seedrandom(
      getRandomContextNamespace([this.context.seed + this.context.namespace]),
    );
  }

  random(): number {
    return this.rng();
  }

  chance(percent: number): boolean {
    return this.random() <= percent;
  }
}

export type RNGMap = {
  mobs: Random;
};

export const RNG: RNGMap = {
  mobs: new Random({
    seed: DEFAULT_SEED,
    namespace: MOBS_NAMESPACE_SEPARATOR,
  }),
};
