import type { Entity } from "../../../../../core/model/Entity";
import { removeComponentsByType } from "../../../../../core/model/queries/components/remove";
import { WorldActionType } from "../../../../systems/world/types";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { PantsSlotComponent } from "../../../components/eq/slots/PantsSlotComponent";
import type { Manual } from "../../../Manual";
import { getContainerItemAt } from "../../../queries/containers";
import { getEqSlotByType } from "../../../queries/eq";
import { getPlayerEntity } from "../../../queries/player";

export const RingEntityManual: Manual = {
  shouldBeCursed(item: Entity): boolean {
    const pantsSlot = getEqSlotByType(getPlayerEntity(), PantsSlotComponent);
    return getContainerItemAt(pantsSlot, 1)?.id === item.id;
  },

  curse(gameAction, item) {
    removeComponentsByType(item, RemovableComponent.type);
    const pantsSlot = getEqSlotByType(getPlayerEntity(), PantsSlotComponent);
    gameAction.addPendingAction(
      {
        type: WorldActionType.DISABLE,
        entityId: pantsSlot.id,
      },
      false,
      3,
    );
  },
};
