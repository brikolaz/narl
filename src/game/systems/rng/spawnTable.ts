import type { MobEntity } from "../../model/entities/mobs/MobEntity";
import { RAGE_BAIT_NAME } from "../../model/entities/mobs/RageBait";
import { getMobClass } from "./getMobClass";
import { RNG } from "./random";
import { getZone, Zone } from "./zones";

const SPAWN_TABLE = {
  [Zone.START]: {},
  [Zone.EARLY]: {
    [RAGE_BAIT_NAME]: 15,
  },
  [Zone.LOW]: {},
  [Zone.MID]: {},
  [Zone.HIGH]: {},
  [Zone.LATE]: {},
  [Zone.FINAL]: {},
} satisfies Record<Zone, Record<string, number>>;

const getTotalChance = (): number => {
    return 100
};

export const getRandomMob = (position: number): MobEntity | undefined => {
  const zone = getZone(position);
  const table = SPAWN_TABLE[zone];
  let mob: MobEntity | undefined = undefined;

  for (const [mobName, chance] of Object.entries(table)) {
    const roll = RNG.mobs.random() * getTotalChance();
    if (roll <= chance) {
      mob = new (getMobClass(mobName))();
      break;
    }
  }

  return mob;
};
