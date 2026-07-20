import type { Entity } from "../../../../../core/ecs/Entity";
import { removeComponentsByType } from "../../../../../core/ecs/queries/components/remove";
import { EqSlot } from "../../../../systems/eq/types";
import { RemovableComponent } from "../../../components/eq/RemovableComponent";
import { getContainerItemAt } from "../../../queries/containers";
import { getEqSlot } from "../../../queries/eq";
import { getPlayerEntity } from "../../../queries/player";

export class RingEntityManual {
  static shouldBeCursed(item: Entity): boolean {
    const pantsSlot = getEqSlot(getPlayerEntity(), EqSlot.PANTS);
    return getContainerItemAt(pantsSlot, 1)?.id === item.id;
  }

  static curse(item: Entity) {
    removeComponentsByType(item, RemovableComponent.type);
  }
}
