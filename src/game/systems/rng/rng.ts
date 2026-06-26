import {
  DEFAULT_SEED,
  ITEMS_RNG_NAMESPACE,
  MOBS_RNG_NAMESPACE,
} from "../../../utils/constants";
import { Random } from "./random";

type RNGTypes = "mobs" | "items";
export type RNGMap = Record<RNGTypes, Random>;

export const RNG: RNGMap = {
  mobs: new Random({
    seed: DEFAULT_SEED,
    namespace: MOBS_RNG_NAMESPACE,
  }),
  items: new Random({
    seed: DEFAULT_SEED,
    namespace: ITEMS_RNG_NAMESPACE,
  }),
};
