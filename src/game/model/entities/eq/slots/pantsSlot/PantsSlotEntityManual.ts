import { upsertComponents } from "../../../../../../core/ecs/queries/components/add";
import { detachEntity } from "../../../../../../core/ecs/queries/entities/remove";
import { DisabledComponent } from "../../../../components/DisabledComponent";
import type { Manual } from "../../../../Manual";
import { getContainerItemAt } from "../../../../queries/containers";
import { isCursed } from "../../../../queries/curse";
import { RingEntity } from "../../../items/ring/RingEntity";

export const PantsSlotEntityManual: Manual = {
  disable(entity, gameAction) {
    const itemAtSlot = getContainerItemAt(entity, 1);
    if (
      itemAtSlot &&
      itemAtSlot.type === RingEntity.type &&
      isCursed(itemAtSlot)
    ) {
      gameAction.info("You lost your dignity");
      detachEntity(itemAtSlot);
    }
    upsertComponents(itemAtSlot, DisabledComponent());
  },
};
