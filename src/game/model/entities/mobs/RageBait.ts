import { ExpComponent } from "../../components";
import { HpComponent } from "../../components/HpComponent";
import { BackpackEntity } from "../items/BackpackEntity";
import { MobEntity } from "./MobEntity";

export class RageBaitEntity extends MobEntity {
  constructor() {
    const hp = new HpComponent({ hp: 10 });
    const exp = new ExpComponent({ exp: 20 });
    const backpack = new BackpackEntity();
    super({
      name: "Rage Bait",
      glyph: "r",
      components: [hp, exp],
      entities: [backpack],
    });
  }
}
