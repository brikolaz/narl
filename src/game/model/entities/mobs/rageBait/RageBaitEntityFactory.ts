import type { Component } from "../../../../../core/ecs/Component";
import { addComponents } from "../../../../../core/ecs/queries/component";
import { addEntities } from "../../../../../core/ecs/queries/entities";
import { setContainerItemAt } from "../../../../systems/inv/containers";
import { RNG } from "../../../../systems/rng/rng";
import { HostileComponent } from "../../../components/mobs/HostileComponent";
import { PeacefulComponent } from "../../../components/mobs/PeacefulComponent";
import { EqEntity } from "../../eq/EqEntity";
import { MainHandSlotEntity } from "../../eq/MainHandSlotEntity";
import {
  BackpackEntity,
} from "../../items/backpack/BackpackEntity";
import { BackpackEntityFactory } from "../../items/backpack/BackpackEntityFactory";
import { HornedHelmetEntityFactory } from "../../items/helmet/HelmetEntityFactory";
import type { ItemEntity } from "../../items/ItemEntity";
import { SwordEntityFactory } from "../../items/SwordEntity";
import { RageBaitEntity } from "./RageBaitEntity";

export class RageBaitEntityFactory {
  private static getBase(): RageBaitEntity {
    const rageBait = new RageBaitEntity();

    return rageBait;
  }

  private static getLoot(): BackpackEntity {
    const items: ItemEntity[] = [];

    if (RNG.items.chance(20)) {
      items.push(SwordEntityFactory.getDefault());
    }
    if (RNG.items.chance(50)) {
      items.push(HornedHelmetEntityFactory.getHornedHelmet());
    }
    const backpack = BackpackEntityFactory.getDefault();
    if (RNG.items.chance(5)) {
      BackpackEntityFactory.setDroppable(backpack);
    }
    addEntities(backpack, ...items);

    return backpack;
  }

  private static getEq() {
    const eq = new EqEntity();
    const mainHandSlot = new MainHandSlotEntity();
    const sword = SwordEntityFactory.getDefault();
    setContainerItemAt(mainHandSlot, 1, sword);
    addEntities(eq, mainHandSlot);
    return eq;
  }

  static getDefault(): RageBaitEntity {
    const rageBait = this.getBase();
    addEntities(rageBait, this.getLoot(), this.getEq());
    const hostile = RNG.mobs.chance(1)
      ? new HostileComponent()
      : new PeacefulComponent();
    addComponents(rageBait, hostile as Component);

    return rageBait;
  }
}
