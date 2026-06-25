import { ExpComponent } from "../../../components/mobs/ExpComponent";
import { HpComponent } from "../../../components/mobs/HpComponent";
import { MobEntity } from "../MobEntity";

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
