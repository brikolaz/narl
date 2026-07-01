import {
    getComponentByType,
    upsertComponents,
} from "../../../../../core/ecs/queries/component";
import { COLORS } from "../../../../../utils/colors";
import { ColorComponent } from "../../../components/display/ColorComponent";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { CursedComponent } from "../../../components/items/CursedComponent";
import { VariantComponent } from "../../../components/VariantComponent";
import { isCursed } from "../../../queries/curse";
import { getInspectedTimes } from "../../../queries/inspect";
import { HelmetEntityVariants, type HelmetEntity } from "./HelmetEntity";

export class HelmetEntityManual {
  static curse(item: HelmetEntity): boolean {
    const wasCursed = isCursed(item);
    if (wasCursed) {
      return false;
    }
    const components = [
      new CursedComponent(),
      new ColorComponent({ color: COLORS.CURSED }),
      new PantsComponent(),
    ];
    upsertComponents(item, ...components);
    return true;
  }

  static shouldBeCursed(item: HelmetEntity): boolean {
    const variant = getComponentByType(item, VariantComponent)?.variant;
    const inspected = getInspectedTimes(item);
    return variant === HelmetEntityVariants.HORNED_HELMET && inspected >= 10;
  }
}
