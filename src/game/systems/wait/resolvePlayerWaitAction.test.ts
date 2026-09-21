import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getEntityCreator } from "../../../core/model/Entity"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { getComponentsByType } from "../../../core/model/queries/components/get"
import { patchComponentByType } from "../../../core/model/queries/components/patch"
import { createGame, type Game } from "../../../game"
import { clearItems, clearMobs } from "../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import { NameComponent } from "../../model/components/display/NameComponent"
import { MainHandSlotComponent } from "../../model/components/equipment/slots/MainHandSlotComponent"
import { BlockComponent } from "../../model/components/BlockComponent"
import { DefComponent } from "../../model/components/combat/DefComponent"
import { DmgComponent } from "../../model/components/combat/DmgComponent"
import {
  HostilityEnum,
  HostilityComponent,
} from "../../model/components/ai/HostilityComponent"
import { HpComponent } from "../../model/components/combat/HpComponent"
import { PositionComponent } from "../../model/components/spatial/PositionComponent"
import { getEqSlotByType, initEq } from "../eq/eq"
import { getPlayer } from "../player/player"
import { setContainerItemAt } from "../containers/containers"
import { InternalActionTypeEnum } from "../internal/types"
import { PlayerActionTypeEnum } from "../player/types"
import { DirectionEnum } from "../turn/types"
import { resolveWorldBlockAction } from "../block/resolveWorldBlockAction"
import { resolveWorldCleanupBlockAction } from "../block/resolveWorldCleanupBlockAction"
import { resolveWorldInitBlockAction } from "../block/resolveWorldInitBlockAction"
import { WorldActionTypeEnum } from "../world/types"
import { resolvePlayerWaitAction } from "./resolvePlayerWaitAction"

const TestItem = getEntityCreator("TEST_BLOCK_ITEM")
const TestAttacker = getEntityCreator("TEST_BLOCK_ATTACKER")

describe("wait and block", () => {
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

  it("validates the target before init queues block", () => {
    expect(() =>
      resolveWorldInitBlockAction({
        type: WorldActionTypeEnum.WORLD_INIT_BLOCK,
        entityId: -1,
      }),
    ).toThrow("No entity to block")
  })

  it("adds a DefComponent using the entity's BlockComponent DEF", () => {
    const player = getPlayer()
    patchComponentByType(player, BlockComponent, (block) => {
      block.def = 4
    })

    const resolution = resolveWorldInitBlockAction({
      type: WorldActionTypeEnum.WORLD_INIT_BLOCK,
      entityId: player.id,
    })

    expect(getComponentsByType(player, DefComponent)).toEqual([])
    expect(resolution.pendingActions[0].action).toEqual({
      type: WorldActionTypeEnum.WORLD_BLOCK,
      entityId: player.id,
    })

    const blockResolution = resolveWorldBlockAction({
      type: WorldActionTypeEnum.WORLD_BLOCK,
      entityId: player.id,
    })
    const blockDef = getComponentsByType(player, DefComponent)[0]
    expect(blockDef.def).toBe(4)
    expect(blockResolution.pendingActions[0]).toEqual(
      expect.objectContaining({
        action: {
          type: WorldActionTypeEnum.WORLD_CLEANUP_BLOCK,
          defId: blockDef.id,
        },
        delay: 1,
      }),
    )

    resolveWorldCleanupBlockAction({
      type: WorldActionTypeEnum.WORLD_CLEANUP_BLOCK,
      defId: blockDef.id,
    })
    expect(getComponentsByType(player, DefComponent)).toEqual([])
  })

  it("heals without queuing block out of combat", () => {
    const player = getPlayer()
    patchComponentByType(player, HpComponent, (hp) => {
      hp.hp = 10
    })
    vi.spyOn(player.rng, "range").mockReturnValue(4)

    const resolution = resolvePlayerWaitAction({
      type: PlayerActionTypeEnum.PLAYER_WAIT,
    })
    expect(resolution.pendingActions.map(({ action }) => action.type)).toEqual([
      WorldActionTypeEnum.WORLD_REST,
    ])

    game.dispatch({ type: PlayerActionTypeEnum.PLAYER_WAIT })

    expect(getComponentsByType(player, HpComponent)[0].hp).toBe(14)
    expect(getComponentsByType(player, DefComponent)).toEqual([])
    expect(game.state.timedActions).toEqual([])
    expect(game.state.log.at(-1)?.message).toBe("You wait")
  })

  it("does not heal in combat, logs block, and applies it for one world turn", () => {
    const player = getPlayer()
    patchComponentByType(player, HpComponent, (hp) => {
      hp.hp = 10
    })

    const attacker = TestAttacker()
    const weapon = TestItem()
    upsertComponents(
      attacker,
      HostilityComponent({ hostility: HostilityEnum.HOSTILE }),
      NameComponent({ name: "Attacker" }),
      PositionComponent({ position: 1 }),
    )
    upsertComponents(weapon, DmgComponent({ min: 5, max: 5 }))
    initEq(attacker)
    setContainerItemAt(
      getEqSlotByType(attacker, MainHandSlotComponent),
      1,
      weapon,
    )
    game.state.world[1].mobs.push(attacker)

    game.dispatch({ type: PlayerActionTypeEnum.PLAYER_WAIT })

    expect(getComponentsByType(player, HpComponent)[0].hp).toBe(6)
    expect(
      getComponentsByType(player, DefComponent).map(({ def }) => def),
    ).toEqual([1])
    expect(game.state.log.some(({ message }) => message === "You block.")).toBe(
      true,
    )
    expect(
      game.state.log.some(
        ({ action }) => action.type === WorldActionTypeEnum.WORLD_HEAL,
      ),
    ).toBe(false)

    clearMobs(game)
    game.dispatch({
      type: PlayerActionTypeEnum.PLAYER_MOVE,
      direction: DirectionEnum.RIGHT,
    })

    expect(getComponentsByType(player, DefComponent)).toEqual([])
  })
})
