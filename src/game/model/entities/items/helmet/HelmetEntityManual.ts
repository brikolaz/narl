import type { Entity } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { hasComponentsByType } from "../../../../../core/model/queries/components/has";
import { removeComponentsByType } from "../../../../../core/model/queries/components/remove";
import { HeadComponent } from "../../../components/eq/HeadComponent";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { SpikeComponent } from "../../../components/items/SpikeComponent";
import type { Manual } from "../../../Manual";
import { getInspectedTimes } from "../../../queries/inspect";

export const HelmetEntityManual: Manual = {
  curse(_gameAction, item) {
    removeComponentsByType(item, HeadComponent);
    upsertComponents(item, PantsComponent());
  },

  shouldBeCursed(item: Entity): boolean {
    const inspected = getInspectedTimes(item);
    return hasComponentsByType(item, SpikeComponent) && inspected >= 10;
  },
};
