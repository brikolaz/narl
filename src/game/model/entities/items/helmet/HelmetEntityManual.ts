import {
  getComponentByType,
  upsertComponents,
} from "../../../../../core/ecs/queries/component";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import { getInspectedTimes } from "../../../queries/inspect";
import { HelmetEntityVariants, type HelmetEntity } from "./HelmetEntity";

export class HelmetEntityManual {
  static curse(item: HelmetEntity) {
    const components = [
      new PantsComponent(),
    ];
    upsertComponents(item, ...components);
  }

  static shouldBeCursed(item: HelmetEntity): boolean {
    const variant = getComponentByType(item, VariantComponent)?.variant;
    const inspected = getInspectedTimes(item);
    return variant === HelmetEntityVariants.HORNED_HELMET && inspected >= 10;
  }
}
