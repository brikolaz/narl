import type { Component } from "../../../../../core/ecs/Component";
import { addComponents as upsertComponents } from "../../../../../core/ecs/queries/component";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { RingComponent } from "../../../components/eq/RingComponent";
import { DroppableComponent } from "../../../components/items/DroppableComponent";
import { PickupableComponent } from "../../../components/items/PickupableComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import { RingEntity, RingEntityVariants } from "./RingEntity";

export class RingEntityFactory {
  private static getBase(): RingEntity {
    const ring = new RingEntity();

    return ring;
  }

  static getDefault(): RingEntity {
    const ring = this.getBase();

    const ringSlot = new RingComponent();
    const pantsSlot = new PantsComponent();
    const pickupable = new PickupableComponent();
    const droppable = new DroppableComponent();
    const variant = new VariantComponent({
      variant: RingEntityVariants.RING,
    });

    upsertComponents(
      ring,
      ...([ringSlot, pantsSlot, pickupable, droppable, variant] as Component[]),
    );

    return ring;
  }
}
