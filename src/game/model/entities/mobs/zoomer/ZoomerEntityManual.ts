import type { Entity } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import type { Action } from "../../../../systems/actions/action";
import { getRng } from "../../../../systems/rng/rng";
import { WorldActionType } from "../../../../systems/world/types";
import { BleedComponent } from "../../../components/BleedComponent";
import type { Manual } from "../../../Manual";

export const ZoomerEntityManual: Manual = {
  onAttack: (action: Action, source: Entity, target: Entity) => {
    const rng = getRng(source);
    if (rng.chance(50)) {
      const bleed = BleedComponent({ min: 3, max: 4 });
      upsertComponents(target, bleed);
      action.addPendingImmediateAction(
        {
          type: WorldActionType.INIT_BLEED,
          bleedId: bleed.id,
        },
        2,
      );
    }
  },
};
