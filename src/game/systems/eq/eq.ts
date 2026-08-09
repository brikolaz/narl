import type { Component } from "../../../core/model/Component";

export type EqSlot = 1 | 2 | 3 | 4 | 5 | 6;
export const ALL_EQ_SLOTS = new Set<EqSlot>([1, 2, 3, 4, 5, 6]);
export type EqSlotComponent = Component<undefined>;