import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { getEntityCreator, type Entity } from "../../../core/model/Entity"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { patchComponentByType } from "../../../core/model/queries/components/patch"
import { getComponentByType } from "../../../core/model/queries/components/get"
import { createGame, type Game } from "../../../game"
import { clearItems, clearMobs } from "../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import {
  HostilityEnum,
  HostilityComponent,
} from "../../model/components/ai/HostilityComponent"
import { ProvokableComponent } from "../../model/components/ai/ProvokableComponent"
import { NameComponent } from "../../model/components/display/NameComponent"
import { InspectDescComponent } from "../../model/components/interaction/InspectDescComponent"
import { InspectedComponent } from "../../model/components/interaction/InspectedComponent"
import { PositionComponent } from "../../model/components/spatial/PositionComponent"
import { RageBaitEntityFactory } from "../../model/entities/mobs/rageBait/factory"
import { resolveWorldAttackAction } from "../attack/resolveWorldAttackAction"
import { getInspectedTimes } from "../inspect/inspect"
import { InternalActionTypeEnum } from "../internal/types"
import { getPlayer } from "../player/player"
import { setPosition } from "../position/position"
import { DirectionEnum } from "../turn/types"
import { WorldActionTypeEnum } from "../world/types"
import { resolveWorldPokeAction } from "./resolveWorldPokeAction"

const TestMob = getEntityCreator("TEST_POKE_MOB")

const placeMob = (game: Game, mob: Entity, position: number): Entity => {
  setPosition(mob, position)
  game.state.world[position].mobs.push(mob)
  return mob
}

const createTestMob = (game: Game, name: string, position: number): Entity => {
  const mob = TestMob()
  upsertComponents(
    mob,
    NameComponent({ name }),
    PositionComponent(),
    InspectedComponent(),
    InspectDescComponent({ text: "Looks testable" }),
  )
  return placeMob(game, mob, position)
}

describe("resolveWorldPokeAction", () => {
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
  })

  it("resolves through the game action map, inspects the target, and consumes a turn", () => {
    const player = getPlayer()
    const target = createTestMob(game, "Target", 1)
    const startingTurn = game.state.turn

    game.dispatch({
      type: WorldActionTypeEnum.WORLD_POKE,
      sourceId: player.id,
      direction: DirectionEnum.RIGHT,
    })

    expect(getInspectedTimes(target)).toBe(1)
    expect(game.state.log).toContainEqual(
      expect.objectContaining({
        message: "You poked Target. Looks testable",
        action: expect.objectContaining({
          type: WorldActionTypeEnum.WORLD_POKE,
        }),
      }),
    )
    expect(game.state.turn).toBe(startingTurn + 1)
  })

  it("fails without consuming a turn when the adjacent tile is empty", () => {
    const resolution = resolveWorldPokeAction({
      type: WorldActionTypeEnum.WORLD_POKE,
      sourceId: getPlayer().id,
      direction: DirectionEnum.RIGHT,
    })

    expect(resolution.consumesTurn).toBe(false)
    expect(resolution.pendingLogs.map(({ message }) => message)).toEqual([
      "Nothing to poke",
    ])
  })

  it("fails without consuming a turn at the world boundary", () => {
    const resolution = resolveWorldPokeAction({
      type: WorldActionTypeEnum.WORLD_POKE,
      sourceId: getPlayer().id,
      direction: DirectionEnum.LEFT,
    })

    expect(resolution.consumesTurn).toBe(false)
    expect(resolution.pendingLogs.map(({ message }) => message)).toEqual([
      "Nothing to poke",
    ])
  })

  it("fails without consuming a turn when the source does not exist", () => {
    const resolution = resolveWorldPokeAction({
      type: WorldActionTypeEnum.WORLD_POKE,
      sourceId: -1,
      direction: DirectionEnum.RIGHT,
    })

    expect(resolution.consumesTurn).toBe(false)
    expect(resolution.pendingLogs.map(({ message }) => message)).toEqual([
      "Nothing to poke",
    ])
  })

  it("allows a mob to poke and inspect the player", () => {
    const source = createTestMob(game, "Poker", 1)
    const player = getPlayer()

    const resolution = resolveWorldPokeAction({
      type: WorldActionTypeEnum.WORLD_POKE,
      sourceId: source.id,
      direction: DirectionEnum.LEFT,
    })

    expect(resolution.consumesTurn).toBe(true)
    expect(resolution.pendingLogs[0].message).toContain("Poker poked You")
    expect(getInspectedTimes(player)).toBe(1)
  })

  it("queues immediate Enrage after inspecting a provoked target", () => {
    const rageBait = placeMob(game, RageBaitEntityFactory.getDefault(), 1)
    patchComponentByType(rageBait, HostilityComponent, (component) => {
      component.hostility = HostilityEnum.PEACEFUL
    })
    patchComponentByType(rageBait, ProvokableComponent, (component) => {
      component.pokeChance = 100
    })
    const sourceId = getPlayer().id

    const resolution = resolveWorldPokeAction({
      type: WorldActionTypeEnum.WORLD_POKE,
      sourceId,
      direction: DirectionEnum.RIGHT,
    })

    expect(resolution.consumesTurn).toBe(true)
    expect(resolution.pendingLogs.map(({ message }) => message)).toEqual([
      "You poked Rage Bait. It looks cute.",
    ])
    expect(getInspectedTimes(rageBait)).toBe(1)
    expect(resolution.pendingActions).toHaveLength(1)
    expect(resolution.pendingActions[0]).toMatchObject({
      delay: 0,
      action: {
        type: WorldActionTypeEnum.WORLD_ENRAGE,
        entityId: rageBait.id,
        sourceId,
      },
    })
    expect(getComponentByType(rageBait, HostilityComponent)?.hostility).toBe(
      HostilityEnum.PEACEFUL,
    )
  })

  it("resolves queued Enrage when Poke is dispatched", () => {
    const rageBait = placeMob(game, RageBaitEntityFactory.getDefault(), 1)
    patchComponentByType(rageBait, HostilityComponent, (component) => {
      component.hostility = HostilityEnum.PEACEFUL
    })
    patchComponentByType(rageBait, ProvokableComponent, (component) => {
      component.pokeChance = 100
    })

    game.dispatch({
      type: WorldActionTypeEnum.WORLD_POKE,
      sourceId: getPlayer().id,
      direction: DirectionEnum.RIGHT,
    })

    expect(getComponentByType(rageBait, HostilityComponent)?.hostility).toBe(
      HostilityEnum.HOSTILE,
    )
    expect(game.state.log).toContainEqual(
      expect.objectContaining({
        message: "You enraged Rage Bait",
        action: expect.objectContaining({
          type: WorldActionTypeEnum.WORLD_ENRAGE,
        }),
      }),
    )
  })

  it("queues World Poke with a direction for an unarmed world attacker", () => {
    const source = createTestMob(game, "Poker", 1)
    const player = getPlayer()

    const resolution = resolveWorldAttackAction({
      type: WorldActionTypeEnum.WORLD_ATTACK,
      sourceId: source.id,
      targetId: player.id,
    })

    expect(resolution.pendingActions).toHaveLength(1)
    expect(resolution.pendingActions[0].action).toEqual({
      type: WorldActionTypeEnum.WORLD_POKE,
      sourceId: source.id,
      direction: DirectionEnum.LEFT,
    })
  })
})
