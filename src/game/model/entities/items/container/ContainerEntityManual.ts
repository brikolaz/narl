import type { Entity } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { getRng } from "../../../../systems/rng/rng";
import { DmgComponent } from "../../../components/combat/DmgComponent";
import { DmgModComponent } from "../../../components/combat/DmgModComponent";
import type { Manual } from "../../../Manual";

export const ContainerEntityManual: Manual = {
  curse(_gameAction, item) {
    const dmg = getRng(item).range(1, 3);
    upsertComponents(
      item,
      DmgModComponent({ dmgMod: 0.5 }),
      DmgComponent({ min: dmg, max: dmg }),
    );
  },

  shouldBeCursed(item: Entity): boolean {
    return !!item;
  },
};
