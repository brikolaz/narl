import type { Entity } from "../../../core/model/Entity";
import { BARE_BLOCK } from "../../../utils/constants";
import { MainHandSlotComponent } from "../../model/components/eq/slots/MainHandSlotComponent";
import { OffhandSlotComponent } from "../../model/components/eq/slots/OffhandSlotComponent";
import { getContainerItems } from "../../model/queries/containers";
import { getDef } from "../../model/queries/def";
import { getEqSlotByType } from "../../model/queries/eq";

export const getBlockDef = (entity: Entity): number => {
  const handItems = [MainHandSlotComponent, OffhandSlotComponent].flatMap(
    (slotType) => getContainerItems(getEqSlotByType(entity, slotType)),
  );
  const handsDef = handItems.reduce(
    (total, item) => total + Math.max(BARE_BLOCK, getDef(item)),
    0,
  );

  return handsDef;
};
