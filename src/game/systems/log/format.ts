import type { DmgRange } from "../hit/types";

// TODO: this should be a part of presenter layer
// change log model
export const formatDmgRange = ({ min, max }: DmgRange): number | string =>
  min === max ? min : `${min}-${max}`;
