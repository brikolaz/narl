import type { Id } from "../../../core/ecs/Id";
import type { Symbols } from "../../../core/ecs/Symbols";

export const EffectType = {
  REMOVE_SLOT: Symbol("REMOVE_SLOT_EFFECT"),
  CURSE: Symbol("CURSE_EFFECT"),
} satisfies Symbols;

export type CurseEffect = {
  type: typeof EffectType.CURSE;
  entityId: Id;
};

export type Effect = CurseEffect;

