import type { Entity } from "../../../core/model/Entity";
import {
  ITEMS_RNG_NAMESPACE,
  MOBS_RNG_NAMESPACE
} from "../../../utils/constants";
import { STATE } from "../../state/state";
import { Random } from "./random";

type RNGTypes = "mobs" | "items";
export type RNG = Random;
export type RNGMap = Record<RNGTypes, RNG>;

// World RNG / defaults
// TODO: create World object, attach RNG to it?
export const RNG: RNGMap = {
  mobs: new Random({
    seed: STATE.seed,
    namespace: MOBS_RNG_NAMESPACE,
  }),
  items: new Random({
    seed: STATE.seed,
    namespace: ITEMS_RNG_NAMESPACE,
  }),
};

export const getRng = (entity: Entity) => {
  return entity.rng;
};
