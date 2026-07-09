import type { Entity } from "../../../../../core/ecs/Entity";
import { upsertComponents } from "../../../../../core/ecs/queries/components/add";
import { RNG } from "../../../../systems/rng/rng";
import { EquippableComponent } from "../../../components/eq/EquippableComponent";
import { DmgComponent } from "../../../components/items/DmgComponent";
import { DmgModComponent } from "../../../components/items/DmgModComponent";

export class ContainerEntityManual {
  static curse(item: Entity) {
    upsertComponents(
      item,
      DmgModComponent({ dmgMod: 0.5 }),
      EquippableComponent(),
      DmgComponent({ dmg: RNG.items.range(1, 3) }),
    );
  }

  static shouldBeCursed(item: Entity): boolean {
    return !!item;
  }
}
