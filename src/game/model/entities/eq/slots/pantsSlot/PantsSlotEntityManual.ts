import { upsertComponents } from "../../../../../../core/model/queries/components/add";
import { hasComponentsByType } from "../../../../../../core/model/queries/components/has";
import { removeComponentsByType } from "../../../../../../core/model/queries/components/remove";
import { detachEntity } from "../../../../../../core/model/queries/entities/remove";
import { getEntityRegistryRecordById } from "../../../../../../core/model/registry/entityRegistry";
import { dropItem } from "../../../../../systems/drop/drop";
import { getEntityName } from "../../../../../systems/inspect/getEntityName";
import { WorldActionType } from "../../../../../systems/world/types";
import { BleedComponent } from "../../../../components/BleedComponent";
import { DisabledComponent } from "../../../../components/DisabledComponent";
import { RingComponent } from "../../../../components/eq/RingComponent";
import { InspectDescComponent } from "../../../../components/inspect/InspectDescComponent";
import { InspectedComponent } from "../../../../components/inspect/InspectedComponent";
import { SpikeComponent } from "../../../../components/items/SpikeComponent";
import type { Manual } from "../../../../Manual";
import { getContainerItemAt } from "../../../../queries/containers";
import { isCursed } from "../../../../queries/curse";
import { isDisabled } from "../../../../queries/disabled";
import { getPlayerEntity, getPlayerPosition } from "../../../../queries/player";
import { DickEntityFactory } from "../../../items/DickEntity";

export const PantsSlotEntityManual: Manual = {
  disable(action, entity) {
    if (hasComponentsByType(entity, DisabledComponent)) {
      return;
    }
    const itemAtSlot = getContainerItemAt(entity, 1);
    if (
      itemAtSlot &&
      hasComponentsByType(itemAtSlot, RingComponent) &&
      isCursed(itemAtSlot)
    ) {
      detachEntity(itemAtSlot);
      dropItem(DickEntityFactory.getDefault(), getPlayerPosition());
      dropItem(itemAtSlot, getPlayerPosition());
      const bleed = BleedComponent({ value: 5 });
      upsertComponents(getPlayerEntity(), bleed);
      action.addPendingImmediateAction({
        type: WorldActionType.INIT_BLEED,
        bleedId: bleed.id,
      });
      const parent =
        getEntityRegistryRecordById(entity.id)?.parent ?? undefined;
      action.info(`${getEntityName(parent)} lost dignity`);
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
      if (hasComponentsByType(entity, SpikeComponent)) {
        return true;
      }
      return false;
    }
    return true;
  },
};
