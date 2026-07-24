import { upsertComponents } from "../../../../../../core/ecs/queries/components/add";
import { getComponentByType } from "../../../../../../core/ecs/queries/components/get";
import { removeComponentsByType } from "../../../../../../core/ecs/queries/components/remove";
import { detachEntity } from "../../../../../../core/ecs/queries/entities/remove";
import { dropItem } from "../../../../../systems/drop/drop";
import { DisabledComponent } from "../../../../components/DisabledComponent";
import { InspectDescComponent } from "../../../../components/inspect/InspectDescComponent";
import { InspectedComponent } from "../../../../components/inspect/InspectedComponent";
import { VariantComponent } from "../../../../components/VariantComponent";
import type { Manual } from "../../../../Manual";
import { getContainerItemAt } from "../../../../queries/containers";
import { isCursed } from "../../../../queries/curse";
import { isDisabled } from "../../../../queries/disabled";
import { getPlayerPosition } from "../../../../queries/player";
import { HelmetEntityVariants } from "../../../items/helmet/HelmetEntity";
import { RingEntity } from "../../../items/ring/RingEntity";

export const PantsSlotEntityManual: Manual = {
  disable(gameAction, entity) {
    const itemAtSlot = getContainerItemAt(entity, 1);
    if (
      itemAtSlot &&
      itemAtSlot.type === RingEntity.type &&
      isCursed(itemAtSlot)
    ) {
      gameAction.info("You lost your dignity");
      detachEntity(itemAtSlot);
      dropItem(itemAtSlot, getPlayerPosition());
    }
    upsertComponents(entity, DisabledComponent());
    removeComponentsByType(entity, InspectDescComponent.type);
    upsertComponents(
      entity,
      InspectedComponent(),
      InspectDescComponent({
        text: "In the Pants slot, you see nothing. It stares back at you",
      }),
    );
  },

  canAdd(pantsSlot, entity) {
    if (isDisabled(pantsSlot)) {
      if (
        getComponentByType(entity, VariantComponent)?.variant ===
        HelmetEntityVariants.HORNED_HELMET
      ) {
        return true;
      }
      return false;
    }
    return true;
  },
};
