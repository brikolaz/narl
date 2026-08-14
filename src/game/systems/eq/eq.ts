import type { ComponentTypeArgument } from "../../../core/model/queries/components/normalize";

export type EqSlot = 1 | 2 | 3 | 4 | 5 | 6;
export const ALL_EQ_SLOTS = new Set<EqSlot>([1, 2, 3, 4, 5, 6]);
export type EqSlotComponent = ComponentTypeArgument;