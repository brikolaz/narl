import type { Entity } from "../../../../../core/model/Entity";
import { upsertComponents } from "../../../../../core/model/queries/components/add";
import { RNG } from "../../../../systems/rng/rng";
import { EquippableComponent } from "../../../components/eq/EquippableComponent";
import { DmgComponent } from "../../../components/items/DmgComponent";
import { DmgModComponent } from "../../../components/items/DmgModComponent";
import type { Manual } from "../../../Manual";

export const ContainerEntityManual: Manual = {
  curse(_gameAction, item) {
    upsertComponents(
      item,
      DmgModComponent({ dmgMod: 0.5 }),
      EquippableComponent(),
      DmgComponent({ dmg: RNG.items.range(1, 3) }),
    );
  },

  shouldBeCursed(item: Entity): boolean {
    return !!item;
  },
};
