import type { Entity } from "../../../core/model/Entity"
import { createEnum, type EnumType } from "../../../utils/types/Enum"
import { getMobFactory } from "../../model/entities/getFactory"
import { BoomerEntity } from "../../model/entities/mobs/boomer/BoomerEntity"
import type { MobEntityVariants } from "../../model/entities/mobs/factories"
import { RageBaitEntity } from "../../model/entities/mobs/rageBait/RageBaitEntity"
import { ZoomerEntity } from "../../model/entities/mobs/zoomer/ZoomerEntity"
import { STATE } from "../../state/state"
import { setPosition } from "../position/position"
import { getZone, ZoneEnum } from "./zones"

type SpawnTable = Map<MobEntityVariants, number>

export const MobTypeEnum = createEnum("MOB", "PURSUER")
type MobTypeEnum = EnumType<typeof MobTypeEnum>

const SPAWN_TABLE = {
  [ZoneEnum.EARLY]: new Map<MobEntityVariants, number>([
    [RageBaitEntity.type, 10],
    [ZoomerEntity.type, 15],
    [BoomerEntity.type, 15],
  ]),
  [ZoneEnum.LOW]: new Map<MobEntityVariants, number>([
    [RageBaitEntity.type, 15],
    [ZoomerEntity.type, 20],
    [BoomerEntity.type, 20],
  ]),
  [ZoneEnum.MID]: new Map(),
  [ZoneEnum.HIGH]: new Map(),
  [ZoneEnum.LATE]: new Map(),
  [ZoneEnum.FINAL]: new Map(),
} satisfies Record<ZoneEnum, SpawnTable>

const SPAWN_PURSUER_TABLE = {
  [ZoneEnum.EARLY]: new Map<MobEntityVariants, number>([
    [RageBaitEntity.type, 10],
    [ZoomerEntity.type, 15],
    [BoomerEntity.type, 15],
  ]),
  [ZoneEnum.LOW]: new Map<MobEntityVariants, number>([
    [RageBaitEntity.type, 15],
    [ZoomerEntity.type, 20],
    [BoomerEntity.type, 20],
  ]),
  [ZoneEnum.MID]: new Map(),
  [ZoneEnum.HIGH]: new Map(),
  [ZoneEnum.LATE]: new Map(),
  [ZoneEnum.FINAL]: new Map(),
} satisfies Record<ZoneEnum, SpawnTable>

const getSpawnTableTotal = (table: SpawnTable): number =>
  table
    .values()
    .toArray()
    .reduce((sum, chance) => sum + chance, 0)

const validateSpawnTable = (table: SpawnTable): void => {
  const total = getSpawnTableTotal(table)

  if (total > 100) {
    throw new Error(`Spawn table exceeds 100%. Got ${total}%.`)
  }
}

export const validateSpawnTables = (): void => {
  Object.values(SPAWN_TABLE).forEach(validateSpawnTable)
  Object.values(SPAWN_PURSUER_TABLE).forEach(validateSpawnTable)
}

const getSpawnTable = (zone: ZoneEnum, type: MobTypeEnum): SpawnTable =>
  type === MobTypeEnum.PURSUER ? SPAWN_PURSUER_TABLE[zone] : SPAWN_TABLE[zone]

const rollMob = (
  table: SpawnTable,
  roll: number,
  type: MobTypeEnum,
): Entity | undefined => {
  let current = 0

  for (const [mobType, chance] of table) {
    current += chance

    if (roll <= current) {
      const factory = getMobFactory(mobType)

      return type === MobTypeEnum.PURSUER
        ? factory.getPursuer(mobType)
        : factory.getVariant(mobType)
    }
  }
}

export const getRandomMob = (
  position: number,
  type: MobTypeEnum,
): Entity | undefined => {
  const table = getSpawnTable(getZone(position), type)
  const mob = rollMob(table, STATE.rng.mobs.roll(), type)

  if (mob) {
    setPosition(mob, position)
  }

  return mob
}

export const canSpawnMobAt = (position: number, type: MobTypeEnum): boolean =>
  getSpawnTableTotal(getSpawnTable(getZone(position), type)) > 0

export const getGuaranteedRandomMob = (
  position: number,
  type: MobTypeEnum,
): Entity => {
  const table = getSpawnTable(getZone(position), type)
  const total = getSpawnTableTotal(table)

  if (total === 0) {
    throw new Error(`No ${type} to spawn`)
  }

  const mob = rollMob(table, STATE.rng.mobs.range(1, total), type)

  if (!mob) {
    throw new Error(`No ${type} to spawn`)
  }

  setPosition(mob, position)

  return mob
}
