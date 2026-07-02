import { Entity } from "../../core/ecs/Entity";
import { getEntityByType } from "../../core/ecs/queries/entities";
import { EqSlotEntity } from "../model/entities/eq/EqSlotEntity";
import { EQ_SLOT_TO_ENTITY } from "../model/entities/eq/mapping";
import { ItemEntity } from "../model/entities/items/ItemEntity";
import { getEqSlot } from "../model/queries/eq";
import { EqSlot } from "../systems/eq/types";

export type Eq = {
  eqSlots: Record<EqSlot, EqSlotEntity>;
  getItem: (slot: EqSlot) => ItemEntity | undefined;
  eqColumnCount: number;
  eqRowCount: number;
};

export const useEq = (entity: Entity): Eq => {
  const getItem = (slot: EqSlot) => {
    const eqSlot = getEqSlot(entity, slot);
    return getEntityByType(eqSlot, ItemEntity);
  };

  const eqSlots = [...EQ_SLOT_TO_ENTITY.entries()].reduce(
    (prev, [eqSlot]) => ({
      ...prev,
      [eqSlot]: getEqSlot(entity, eqSlot),
    }),
    {} as Record<EqSlot, EqSlotEntity>,
  );

  const eqColumnCount = 3;
  const eqRowCount = Object.values(eqSlots).length / 3;
  return { eqSlots, getItem, eqColumnCount, eqRowCount };
};
