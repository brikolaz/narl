import type { Entity } from "../../../../../core/ecs/Entity";
import { removeComponentsByType } from "../../../../../core/ecs/queries/components/remove";
import { EqSlot } from "../../../../systems/eq/types";
import { WorldActionType } from "../../../../systems/world/types";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import type { Manual } from "../../../Manual";
import { getContainerItemAt } from "../../../queries/containers";
import { getEqSlot } from "../../../queries/eq";
import { getPlayerEntity } from "../../../queries/player";

export const RingEntityManual: Manual = {
  shouldBeCursed(item: Entity): boolean {
    const pantsSlot = getEqSlot(getPlayerEntity(), EqSlot.PANTS);
    return getContainerItemAt(pantsSlot, 1)?.id === item.id;
  },

  curse(gameAction, item) {
    removeComponentsByType(item, RemovableComponent.type);
    const pantsSlot = getEqSlot(getPlayerEntity(), EqSlot.PANTS);
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
