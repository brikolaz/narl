import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { upsertComponents } from "../../../core/model/queries/components/add"
import {
  getComponentByType,
  getComponentsByType,
} from "../../../core/model/queries/components/get"
import { hasComponentsByType } from "../../../core/model/queries/components/has"
import { createGame, type Game } from "../../../game"
import { clearItems, clearMobs } from "../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import { FovComponent } from "../../model/components/ai/FovComponent"
import {
  HostilityComponent,
  HostilityEnum,
} from "../../model/components/ai/HostilityComponent"
import { UnawareComponent } from "../../model/components/ai/UnawareComponent"
import { DroppableComponent } from "../../model/components/interaction/DroppableComponent"
import { MovableComponent } from "../../model/components/spatial/MovableComponent"
import { PositionComponent } from "../../model/components/spatial/PositionComponent"
import { ExpComponent } from "../../model/components/state/ExpComponent"
import { ContainerEntityFactory } from "../../model/entities/items/container/factory"
import { DickEntityFactory } from "../../model/entities/items/dick/factory"
import { BoomerEntityFactory } from "../../model/entities/mobs/boomer/factory"
import { BabyBoomerEntity } from "../../model/entities/mobs/boomer/variants/BabyBoomer/BabyBoomerEntity"
import { RageBaitEntityFactory } from "../../model/entities/mobs/rageBait/factory"
import { WallEntityFactory } from "../../model/entities/wall/factory"
import { assert } from "../../../utils/assert"
import { InternalActionTypeEnum } from "../internal/types"
import {
  addItemToContainer,
  getBackpack,
  getContainerItems,
} from "../containers/containers"
import { getPlayer } from "../player/player"
import { setPosition } from "../position/position"
import { discoverTiles } from "../world/tile"
import { makePursuer } from "./makePursuer"
import { replenishPursuers } from "./pursuer"
import { getAllMobs } from "../mobs/mobs"

describe("pursuer", () => {
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

  it("empties backpack contents", () => {
    const mob = RageBaitEntityFactory.getDefault()
    const backpack = assert(getBackpack(mob), "Mob has no backpack")
    addItemToContainer(backpack, DickEntityFactory.getDefault())

    makePursuer(mob)

    expect(getContainerItems(backpack)).toEqual([])
  })

  it("removes nested backpack contents from the entity registry", () => {
    const mob = RageBaitEntityFactory.getDefault()
    const backpack = assert(getBackpack(mob), "Mob has no backpack")
    const nestedContainer = ContainerEntityFactory.getDefault()
    const nestedItem = DickEntityFactory.getDefault()
    addItemToContainer(nestedContainer, nestedItem)
    addItemToContainer(backpack, nestedContainer)

    makePursuer(mob)

    expect(game.state.entityRegistryById[nestedContainer.id]).toBeUndefined()
    expect(game.state.entityRegistryById[nestedItem.id]).toBeUndefined()
  })

  it("removes the backpack droppable marker", () => {
    const mob = RageBaitEntityFactory.getDefault()
    const backpack = assert(getBackpack(mob), "Mob has no backpack")
    upsertComponents(backpack, DroppableComponent())

    makePursuer(mob)

    expect(hasComponentsByType(backpack, DroppableComponent)).toBe(false)
  })

  it("removes unaware state", () => {
    const mob = RageBaitEntityFactory.getDefault()

    makePursuer(mob)

    expect(hasComponentsByType(mob, UnawareComponent)).toBe(false)
  })

  it("removes experience rewards", () => {
    const mob = RageBaitEntityFactory.getDefault()

    makePursuer(mob)

    expect(hasComponentsByType(mob, ExpComponent)).toBe(false)
  })

  it("makes an immovable mob movable", () => {
    const mob = RageBaitEntityFactory.getDefault()

    makePursuer(mob)

    expect(hasComponentsByType(mob, MovableComponent)).toBe(true)
  })

  it("adds infinite field of view when a mob has none", () => {
    const mob = RageBaitEntityFactory.getDefault()

    expect(getComponentByType(mob, FovComponent)?.range).toBeUndefined()

    makePursuer(mob)

    expect(getComponentByType(mob, FovComponent)?.range).toBe(Infinity)
  })

  it("makes the mob hostile", () => {
    const mob = RageBaitEntityFactory.getDefault()

    makePursuer(mob)

    expect(getComponentsByType(mob, HostilityComponent)).to.have.lengthOf(1)
    expect(getComponentByType(mob, HostilityComponent)?.hostility).toBe(
      HostilityEnum.HOSTILE,
    )
  })

  it("creates the requested mob variant as a pursuer", () => {
    const pursuer = BoomerEntityFactory.getPursuer(BabyBoomerEntity.type)

    expect(pursuer.type).toBe(BabyBoomerEntity.type)
    expect(getComponentByType(pursuer, FovComponent)?.range).toBe(Infinity)
    expect(getComponentByType(pursuer, HostilityComponent)?.hostility).toBe(
      HostilityEnum.FRIENDLY_HOSTILE,
    )
  })

  it("replenishes only missing pursuers behind the player", () => {
    const player = getPlayer()
    setPosition(player, 10)
    vi.spyOn(game.state.rng.mobs, "range").mockReturnValue(0)

    replenishPursuers()

    const pursuers = game.state.world.flatMap((tile) => tile?.mobs ?? [])
    expect(pursuers).toHaveLength(1)
    expect(getComponentByType(pursuers[0], PositionComponent)?.position).toBe(0)
    expect(getComponentByType(pursuers[0], FovComponent)?.range).toBe(Infinity)

    replenishPursuers()

    expect(game.state.world.flatMap((tile) => tile?.mobs ?? [])).toHaveLength(1)
  })

  it("counts only mobs behind the player", () => {
    const player = getPlayer()
    setPosition(player, 20)
    discoverTiles(17)
    clearMobs(game)
    const existingPursuer = RageBaitEntityFactory.getPursuer()
    const mobAheadOfPlayer = RageBaitEntityFactory.getDefault()
    setPosition(existingPursuer, 0)
    setPosition(mobAheadOfPlayer, 21)
    game.state.world[0].mobs.push(existingPursuer)
    game.state.world[21].mobs.push(mobAheadOfPlayer)
    vi.spyOn(game.state.rng.mobs, "range").mockImplementation((min) => min)

    replenishPursuers()

    const positions = game.state.world
      .flatMap((tile) => tile?.mobs ?? [])
      .map((mob) => getComponentByType(mob, PositionComponent)?.position)
    expect(positions).toEqual(expect.arrayContaining([0, 1, 21]))
  })

  it("skips occupied spawn tiles", () => {
    const player = getPlayer()
    setPosition(player, 20)
    const occupiedTileMob = RageBaitEntityFactory.getPursuer()
    setPosition(occupiedTileMob, 0)
    game.state.world[0].mobs.push(occupiedTileMob)
    vi.spyOn(game.state.rng.mobs, "range").mockImplementation((min) => min)

    replenishPursuers()

    expect(game.state.world[1].mobs).toHaveLength(1)
  })

  it("skips impassable spawn tiles", () => {
    const player = getPlayer()
    setPosition(player, 10)
    discoverTiles(5)
    clearMobs(game)
    for (let i = 0; i < 10; i++) {
      const wall = WallEntityFactory.getDefault()
      setPosition(wall, i)
      game.state.world[i].items.push(wall)
    }

    replenishPursuers()

    expect(getAllMobs()).to.be.empty
  })

  it("does not spawn pursuers in the visible area behind the player", () => {
    const player = getPlayer()
    setPosition(player, 10)
    for (const position of [0, 1, 2, 3, 4, 5]) {
      const wall = WallEntityFactory.getDefault()
      setPosition(wall, position)
      game.state.world[position].items.push(wall)
    }

    replenishPursuers()

    expect(game.state.world.flatMap((tile) => tile?.mobs ?? [])).toEqual([])
  })
})
