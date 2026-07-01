import { upsertComponents } from "../../../../../core/ecs/queries/component";
import { RNG } from "../../../../systems/rng/rng";
import { EquippableComponent } from "../../../components/eq/EquippableComponent";
import { DmgComponent } from "../../../components/items/DmgComponent";
import { DmgModComponent } from "../../../components/items/DmgModComponent";
import { BackpackEntity } from "./BackpackEntity";

export class BackpackEntityManual {
  static curse(item: BackpackEntity) {
    const components = [
      new DmgModComponent({ dmgMod: 0.5 }),
      new EquippableComponent(),
      new DmgComponent({ dmg: RNG.items.range(1, 3) }),
    ];

    upsertComponents(item, ...components);
  }

  static shouldBeCursed(item: BackpackEntity): boolean {
    return !!item;
  }
}
