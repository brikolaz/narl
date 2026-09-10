import type { Entity, EntityType } from "../../../core/model/Entity";
import type { Enum, EnumType } from "../../../utils/types/Enum";
import { getMobFactory } from "../../model/entities/getFactory";
import { BoomerEntity } from "../../model/entities/mobs/boomer/BoomerEntity";
import { RageBaitEntity } from "../../model/entities/mobs/rageBait/RageBaitEntity";
import { ZoomerEntity } from "../../model/entities/mobs/zoomer/ZoomerEntity";
import { STATE } from "../../state/state";
import { setPosition } from "../position/position";
import { getZone, Zone } from "./zones";

type SpawnTable = Map<EntityType, number>;

export const MobType = {
  MOB: "mob",
  PURSUER: "pursuer",
} as const satisfies Enum;
type MobType = EnumType<typeof MobType>;

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

const SPAWN_PURSUER_TABLE = {
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

const getSpawnTableTotal = (table: SpawnTable): number =>
  table
    .values()
    .toArray()
    .reduce((sum, chance) => sum + chance, 0);

const validateSpawnTable = (table: SpawnTable): void => {
  const total = getSpawnTableTotal(table);

  if (total > 100) {
    throw new Error(`Spawn table exceeds 100%. Got ${total}%.`);
  }
};

export const validateSpawnTables = (): void => {
  Object.values(SPAWN_TABLE).forEach(validateSpawnTable);
  Object.values(SPAWN_PURSUER_TABLE).forEach(validateSpawnTable);
};

const getSpawnTable = (zone: Zone, type: MobType): SpawnTable =>
  type === MobType.PURSUER
    ? SPAWN_PURSUER_TABLE[zone]
    : SPAWN_TABLE[zone];

const rollMob = (
  table: SpawnTable,
  roll: number,
  type: MobType,
): Entity | undefined => {
  let current = 0;

  for (const [mobType, chance] of table) {
    current += chance;

    if (roll <= current) {
      const factory = getMobFactory(mobType);

      return type === MobType.PURSUER
        ? factory.getPursuer()
        : factory.getDefault();
    }
  }
};

export const getRandomMob = (
  position: number,
  type: MobType,
): Entity | undefined => {
  const table = getSpawnTable(getZone(position), type);
  const mob = rollMob(table, STATE.rng.mobs.roll(), type);

  if (mob) {
    setPosition(mob, position);
  }

  return mob;
};

export const canSpawnMobAt = (
  position: number,
  type: MobType,
): boolean =>
  getSpawnTableTotal(getSpawnTable(getZone(position), type)) > 0;

export const getGuaranteedRandomMob = (
  position: number,
  type: MobType,
): Entity => {
  const table = getSpawnTable(getZone(position), type);
  const total = getSpawnTableTotal(table);

  if (total === 0) {
    throw new Error(`No ${type} to spawn`);
  }

  const mob = rollMob(
    table,
    STATE.rng.mobs.range(1, total),
    type,
  );

  if (!mob) {
    throw new Error(`No ${type} to spawn`);
  }

  setPosition(mob, position);

  return mob;
};