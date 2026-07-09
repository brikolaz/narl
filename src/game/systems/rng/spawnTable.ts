import type { Entity, EntityType } from "../../../core/ecs/Entity";
import { getFactory } from "../../model/entities/getFactory";
import { RageBaitEntity } from "../../model/entities/mobs/rageBait/RageBaitEntity";
import { RNG } from "./rng";
import { getZone, Zone } from "./zones";

type SpawnTable = Map<EntityType, number>;
const SPAWN_TABLE = {
  [Zone.START]: new Map(),
  [Zone.EARLY]: new Map([[RageBaitEntity.type, 15]]),
  [Zone.LOW]: new Map(),
  [Zone.MID]: new Map(),
  [Zone.HIGH]: new Map(),
  [Zone.LATE]: new Map(),
  [Zone.FINAL]: new Map(),
} satisfies Record<Zone, SpawnTable>;

export const validateSpawnTables = (): void => {
  const validateSpawnTable = (table: SpawnTable): void => {
    const total = [...table.values()].reduce((sum, chance) => sum + chance, 0);

    if (total > 100) {
      throw new Error(`Spawn table exceeds 100%. Got ${total}%.`);
    }
  };
  Object.values(SPAWN_TABLE).forEach(validateSpawnTable);
};

const getSpawnTable = (zone: Zone): SpawnTable => {
  const table = SPAWN_TABLE[zone];
  return table;
};

export const getRandomMob = (position: number): Entity | undefined => {
  const zone = getZone(position);
  const table = getSpawnTable(zone);

  let mob: Entity | undefined = undefined;
  const roll = RNG.mobs.roll();
  let current = 0;

  for (const [mobClass, chance] of table) {
    current += chance;
    if (roll <= current) {
      mob = getFactory(mobClass).getDefault();
      break;
    }
  }

  return mob;
};
