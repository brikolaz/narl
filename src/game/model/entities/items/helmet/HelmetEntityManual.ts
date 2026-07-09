import type { Entity } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { getComponentByType } from "../../../../../core/ecs/queries/components/get";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import { getInspectedTimes } from "../../../queries/inspect";
import { HelmetEntity, HelmetEntityVariants } from "./HelmetEntity";

export class HelmetEntityManual {
  static curse(item: Entity) {
    upsertComponents(item, PantsComponent());
  }

  static shouldBeCursed(item: Entity): boolean {
    const variant = getComponentByType(item, VariantComponent)?.variant;
    const inspected = getInspectedTimes(item);
    return (
      item.type === HelmetEntity.type &&
      variant === HelmetEntityVariants.HORNED_HELMET &&
      inspected >= 10
    );
  }
}
