import type { Entity } from "../../core/ecs/Entity";
import { EQ_SLOT_TO_ENTITY } from "../model/entities/eq/mapping";
import { getContainerItemAt } from "../model/queries/containers";
import { getEqSlot } from "../model/queries/eq";
import { EqSlot } from "../systems/eq/types";

export type Eq = {
  eqSlots: Record<EqSlot, Entity>;
  getItem: (slot: EqSlot) => Entity | undefined;
  eqColumnCount: number;
  eqRowCount: number;
};

export const useEq = (entity: Entity): Eq => {
  const getItem = (slot: EqSlot) => {
    const eqSlot = getEqSlot(entity, slot);
    return getContainerItemAt(eqSlot, 1);
  };

  const eqSlots = [...EQ_SLOT_TO_ENTITY.entries()].reduce(
    (prev, [eqSlot]) => ({
      ...prev,
      [eqSlot]: getEqSlot(entity, eqSlot),
    }),
    {} as Record<EqSlot, Entity>,
  );

  const eqColumnCount = 3;
  const eqRowCount = Object.values(eqSlots).length / 3;
  return { eqSlots, getItem, eqColumnCount, eqRowCount };
};
