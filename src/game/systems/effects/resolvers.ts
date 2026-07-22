import type { ActionResolution, GameAction } from "../actions/types";
import { applyCurseEffect } from "./curse/applyCurseEffect";
import { EffectType, type Effect } from "./effects";

export type AnyEffectResolver = (action: GameAction, effect: any) => ActionResolution;

export const effectResolvers = {
  [EffectType.CURSE]: applyCurseEffect,
} satisfies Record<Effect["type"], AnyEffectResolver>;
