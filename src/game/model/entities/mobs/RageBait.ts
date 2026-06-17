import type { Component } from "../../../../core/ecs/Component";
import { addComponents } from "../../../../core/ecs/queries/component";
import { addEntities } from "../../../../core/ecs/queries/entities";
import { RNG } from "../../../systems/rng/rng";
import { ExpComponent } from "../../components/ExpComponent";
import { HpComponent } from "../../components/HpComponent";
import { HostileComponent } from "../../components/mobs/HostileComponent";
import { PeacefulComponent } from "../../components/mobs/PeacefulComponent";
import { BackpackEntity, BackpackEntityFactory } from "../items/BackpackEntity";
import {
  HornedHelmetEntityFactory
} from "../items/HornedHelmetEntity";
import type { ItemEntity } from "../items/ItemEntity";
import { SwordEntityFactory } from "../items/SwordEntity";
import { MobEntity } from "./MobEntity";

export const RAGE_BAIT_NAME = "Rage Bait";

export class RageBaitEntity extends MobEntity {
  constructor() {
    const hp = new HpComponent({ hp: 10 });
    const exp = new ExpComponent({ exp: 20 });

    super({
      name: RAGE_BAIT_NAME,
      glyph: "r",
      components: [hp, exp],
      entities: [],
    });
  }
}

export class RageBaitEntityFactory {
  private static getBase(): RageBaitEntity {
    const rageBait = new RageBaitEntity();

    const hp = new HpComponent({ hp: 10 });
    const exp = new ExpComponent({ exp: 20 });
    addComponents(rageBait, ...([hp, exp] as Component[]));

    return rageBait;
  }

  private static getLoot(): BackpackEntity {
    const items: ItemEntity[] = [];

    if (RNG.items.chance(20)) {
      items.push(SwordEntityFactory.getDefault());
    }
    if (RNG.items.chance(50)) {
      items.push(HornedHelmetEntityFactory.getDefault());
    }
    const backpack = BackpackEntityFactory.getDefault();
    if (RNG.items.chance(5)) {
      BackpackEntityFactory.setDroppable(backpack);
    }
    addEntities(backpack, ...items);

    return backpack;
  }

  static getDefault(): RageBaitEntity {
    const rageBait = this.getBase();
    addEntities(rageBait, this.getLoot());
    const hostile = RNG.mobs.chance(1)
      ? new HostileComponent()
      : new PeacefulComponent();
    addComponents(rageBait, hostile as Component);

    return rageBait;
  }
}
