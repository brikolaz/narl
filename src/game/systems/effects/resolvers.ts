import type { ActionResolution, GameAction } from "../actions/types";
import { applyCurseEffect } from "./curse/applyCurseEffect";
import { applyDisableSlotEffect } from "./disableSlot/applyDisableSlotEffect";
import { EffectType, type Effect } from "./types";

export type AnyEffectResolver = (
  action: GameAction,
  effect: any,
) => ActionResolution;

export const effectResolvers = {
  [EffectType.CURSE]: applyCurseEffect,
  [EffectType.DISABLE_SLOT]: applyDisableSlotEffect,
} satisfies Record<Effect["type"], AnyEffectResolver>;
