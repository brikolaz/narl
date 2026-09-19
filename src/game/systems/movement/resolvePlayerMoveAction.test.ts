import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getEntityCreator } from "../../../core/model/Entity"
import { upsertComponents } from "../../../core/model/queries/components/add"
import { patchComponentByType } from "../../../core/model/queries/components/patch"
import { getComponentsByType } from "../../../core/model/queries/components/get"
import { createGame, type Game } from "../../../game"
import { clearItems, clearMobs } from "../../../tests/clear"
import {
  expectGameStateConsistent,
  isIntegrityCheckEnabled,
} from "../../../tests/integrity"
import {
  HostilityComponent,
  HostilityEnum,
} from "../../model/components/ai/HostilityComponent"
import { HpComponent } from "../../model/components/combat/HpComponent"
import { PositionComponent } from "../../model/components/spatial/PositionComponent"
import { InternalActionTypeEnum } from "../internal/types"
import { getPlayer } from "../player/player"
import { getPosition } from "../position/position"
import { DirectionEnum } from "../turn/types"
import { PlayerActionTypeEnum } from "../player/types"
import { WorldActionTypeEnum } from "../world/types"
import { discoverTiles } from "../world/tile"
import { resolvePlayerMoveAction } from "./resolvePlayerMoveAction"

const TestHostile = getEntityCreator("TEST_MOVE_HOSTILE")

describe("resolvePlayerMoveAction", () => {
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

  it("queues rest after moving successfully into a safe visible area", () => {
    const player = getPlayer()

    const resolution = resolvePlayerMoveAction({
      type: PlayerActionTypeEnum.PLAYER_MOVE,
      direction: DirectionEnum.RIGHT,
    })

    expect(getPosition(player)).toBe(1)
    expect(resolution.pendingActions.map(({ action }) => action)).toEqual([
      {
        type: WorldActionTypeEnum.WORLD_REST,
        entityId: player.id,
      },
    ])
  })

  it("heals the player after a successful safe move", () => {
    const player = getPlayer()
    patchComponentByType(player, HpComponent, (hp) => {
      hp.hp = 10
    })
    const range = vi.spyOn(player.rng, "range").mockReturnValue(4)

    game.dispatch({
      type: PlayerActionTypeEnum.PLAYER_MOVE,
      direction: DirectionEnum.RIGHT,
    })

    expect(getPosition(player)).toBe(1)
    expect(range).toHaveBeenCalledWith(4, 5)
    expect(getComponentsByType(player, HpComponent)[0].hp).toBe(14)
  })

  it("evaluates safety after moving when a hostile enters the visible area", () => {
    const player = getPlayer()
    patchComponentByType(player, PositionComponent, (position) => {
      position.position = 4
    })
    discoverTiles(9)
    const hostile = TestHostile()
    upsertComponents(
      hostile,
      HostilityComponent({ hostility: HostilityEnum.HOSTILE }),
      PositionComponent({ position: 9 }),
    )
    game.state.world[9].mobs.push(hostile)

    const resolution = resolvePlayerMoveAction({
      type: PlayerActionTypeEnum.PLAYER_MOVE,
      direction: DirectionEnum.RIGHT,
    })

    expect(getPosition(player)).toBe(5)
    expect(resolution.pendingActions).toEqual([])
  })

  it("does not queue rest for a move that cannot be completed", () => {
    const resolution = resolvePlayerMoveAction({
      type: PlayerActionTypeEnum.PLAYER_MOVE,
      direction: DirectionEnum.LEFT,
    })

    expect(getPosition(getPlayer())).toBe(0)
    expect(resolution.pendingActions).toEqual([])
  })
})
