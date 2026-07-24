import type { Entity } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { hasComponentsByType } from "../../../../../core/ecs/queries/components/has";
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
