import type { Entity } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { hasComponentsByType } from "../../../../../core/model/queries/components/has";
import { PantsComponent } from "../../../components/eq/PantsComponent";
import { SpikeComponent } from "../../../components/items/SpikeComponent";
import type { Manual } from "../../../Manual";
import { getInspectedTimes } from "../../../queries/inspect";

export const HelmetEntityManual: Manual = {
  curse(_gameAction, item) {
    upsertComponents(item, PantsComponent());
  },

  shouldBeCursed(item: Entity): boolean {
    const inspected = getInspectedTimes(item);
    return (
      hasComponentsByType(item, SpikeComponent) &&
      inspected >= 10
    );
  },
};
