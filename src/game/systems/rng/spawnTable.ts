import type { Entity, EntityType } from "../../../core/model/Entity";
import { getFactory } from "../../model/entities/getFactory";
import { BoomerEntity } from "../../model/entities/mobs/boomer/BoomerEntity";
import { RageBaitEntity } from "../../model/entities/mobs/rageBait/RageBaitEntity";
import { ZoomerEntity } from "../../model/entities/mobs/zoomer/ZoomerEntity";
import { STATE } from "../../state/state";
import { setPosition } from "../position/position";
import { getZone, Zone } from "./zones";

type SpawnTable = Map<EntityType, number>;
const SPAWN_TABLE = {
  [Zone.START]: new Map(),
  [Zone.EARLY]: new Map([
    [RageBaitEntity.type, 10],
    [ZoomerEntity.type, 15],
    [BoomerEntity.type, 15],
  ]),
  [Zone.LOW]: new Map(),
  [Zone.MID]: new Map(),
  [Zone.HIGH]: new Map(),
  [Zone.LATE]: new Map(),
  [Zone.FINAL]: new Map(),
} satisfies Record<Zone, SpawnTable>;

export const validateSpawnTables = (): void => {
  const validateSpawnTable = (table: SpawnTable): void => {
    const total = table
      .values()
      .toArray()
      .reduce((sum, chance) => sum + chance, 0);

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

const getSpawnTableTotal = (table: SpawnTable): number =>
  table.values().toArray().reduce((sum, chance) => sum + chance, 0);

const rollMob = (table: SpawnTable, roll: number): Entity | undefined => {
  let current = 0;

  for (const [mobClass, chance] of table) {
    current += chance;
    if (roll <= current) {
      return getFactory(mobClass).getDefault();
    }
  }
};

export const getRandomMob = (position: number): Entity | undefined => {
  const zone = getZone(position);
  const table = getSpawnTable(zone);
  const mob = rollMob(table, STATE.rng.mobs.roll());

  if (mob) {
    setPosition(mob, position);
  }

  return mob
};

export const canSpawnMobAt = (position: number): boolean =>
  getSpawnTableTotal(getSpawnTable(getZone(position))) > 0;

export const getGuaranteedRandomMob = (
  position: number,
): Entity => {
  const table = getSpawnTable(getZone(position));
  const total = getSpawnTableTotal(table);
  if (total === 0) {
    throw new Error('No mob to spawn');
  }
  const mob = rollMob(table, STATE.rng.mobs.range(1, total));
  if (!mob) {
    throw new Error('No mob to spawn');
  }

  setPosition(mob, position);

  return mob;
};
