import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  EntityRoleEnum,
  getEntityCreator,
  type Entity,
} from "../../../core/model/Entity"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { upsertRoleEntities } from "../../../core/model/queries/entities/add"
import { getEntitiesByRole } from "../../../core/model/queries/entities/get"
import { createGame, type Game } from "../../../game"
import { clearItems, clearMobs } from "../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import { PantsSlotComponent } from "../../model/components/equipment/slots/PantsSlotComponent"
import { ChestSlotComponent } from "../../model/components/equipment/slots/ChestSlotComponent"
import { MainHandSlotComponent } from "../../model/components/equipment/slots/MainHandSlotComponent"
import { DmgComponent } from "../../model/components/combat/DmgComponent"
import { DmgMulComponent } from "../../model/components/combat/DmgMulComponent"
import { BonusStatsEntityFactory } from "../../model/entities/BonusStatsEntity"
import { RingEntityFactory } from "../../model/entities/items/ring/RingEntity"
import { getEqSlotByType, initEq } from "../eq/eq"
import { getAttackDmgRange, rollAttackDmg } from "../attack/dmg"
import { setContainerItemAt } from "../containers/containers"
import { InternalActionTypeEnum } from "../internal/types"
import { getBonusStats } from "./bonusStats"

const TestEntity = getEntityCreator("TEST_ATTACK_DMG")

const createArmor = (dmg: number, dmgMul: number): Entity => {
  const armor = TestEntity()
  const bonusStats = BonusStatsEntityFactory.getDefault()
  upsertComponents(
    bonusStats,
    DmgComponent({ min: dmg, max: dmg }),
    DmgMulComponent({ dmgMul }),
  )
  upsertRoleEntities(armor, {
    [EntityRoleEnum.BONUS_STATS]: bonusStats,
  })
  return armor
}

describe("attack damage", () => {
  let game: Game

  beforeEach(() => {
    game = createGame()
    game.dispatch({ type: InternalActionTypeEnum.INTERNAL_INIT })
    clearMobs(game)
    clearItems(game)
  })

  afterEach(() => {
    if (isIntegrityCheckEnabled()) {
      expectGameStateConsistent(game)
    }

    vi.restoreAllMocks()
  })

  it("adds armor damage before applying all armor damage multipliers", () => {
    const source = TestEntity()
    const weapon = TestEntity()
    const armor = createArmor(2, 1.5)
    const ring = createArmor(3, 2)
    initEq(source)
    upsertComponents(weapon, DmgComponent({ min: 10, max: 10 }))

    setContainerItemAt(
      getEqSlotByType(source, MainHandSlotComponent),
      1,
      weapon,
    )
    setContainerItemAt(getEqSlotByType(source, ChestSlotComponent), 1, armor)
    setContainerItemAt(getEqSlotByType(source, PantsSlotComponent), 1, ring)

    expect(getAttackDmgRange(source)).toEqual({ min: 30, max: 30 })
    expect(rollAttackDmg(source)).toBe(30)
  })

  it("returns default damage when the entity has no attack weapon", () => {
    const source = TestEntity()
    initEq(source)

    expect(getAttackDmgRange(source)).toEqual(DmgComponent.defaults)
  })

  it("stores the ring damage multiplier in its bonus stats entity", () => {
    const ring = RingEntityFactory.getDefault()
    const bonusStats = getBonusStats(ring)

    expect(getEntitiesByRole(ring, EntityRoleEnum.BONUS_STATS)).toEqual([
      bonusStats,
    ])
    expect(getEntitiesByRole(ring, EntityRoleEnum.DEFAULT)).toEqual([])
    expect(getComponentByType(ring, DmgMulComponent)).toBeUndefined()
    expect(getComponentByType(bonusStats, DmgMulComponent)?.dmgMul).toBeOneOf([
      1.5, 2,
    ])
  })
})
