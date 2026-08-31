import {
  ITEMS_RNG_NAMESPACE,
  MOBS_RNG_NAMESPACE,
} from "../../../utils/constants";
import { Random } from "./random";
import type { Seed } from "./seed";

export type WorldRng = {
  readonly mobs: Random;
  readonly items: Random;
};

export const createWorldRng = (seed: Seed): WorldRng =>
  Object.freeze({
    mobs: new Random({
      seed,
      namespace: MOBS_RNG_NAMESPACE,
    }),
    items: new Random({
      seed,
      namespace: ITEMS_RNG_NAMESPACE,
    }),
  });
