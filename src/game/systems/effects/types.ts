import type { Id } from "../../../core/ecs/Id";
import type { Symbols } from "../../../core/ecs/Symbols";
import type { GameAction } from "../actions/types";

export const EffectType = {
  DISABLE_SLOT: Symbol("DISABLE_SLOT_EFFECT"),
  CURSE: Symbol("CURSE_EFFECT"),
} as const satisfies Symbols;

export type CurseEffect = {
  type: typeof EffectType.CURSE;
  entityId: Id;
};

export type DisableSlotEffect = {
  type: typeof EffectType.DISABLE_SLOT;
  entityId: Id;
};

export type Effect = CurseEffect | DisableSlotEffect;

export type TimedEffect = {
  id: Id;
  action: GameAction;
  immediate: boolean;
  effect: Effect;
  turns: number;
};
