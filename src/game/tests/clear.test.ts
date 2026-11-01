import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { Entity } from "../../core/model/Entity"
import { createGame, type Game } from "../../game"
import { MainHandSlotComponent } from "../model/components/equipment/slots/MainHandSlotComponent"
import { SwordEntityFactory } from "../model/entities/items/sword/factory"
import { ContainerEntityFactory } from "../model/entities/items/container/factory"
import { HelmetEntityFactory } from "../model/entities/items/helmet/factory"
import { RageBaitEntityFactory } from "../model/entities/mobs/rageBait/factory"
import {
  addItemsToContainer,
  addItemToEntityBackpack,
  getBackpack,
  getContainerItems,
  getFirstContainerItem,
  setContainerItemAt,
} from "../systems/containers/containers"
import { getEqSlotByType } from "../systems/eq/eq"
import { InternalActionTypeEnum } from "../systems/internal/types"
import { getPlayer } from "../systems/player/player"
import { setPosition } from "../systems/position/position"
import { assert } from "../../core/utils/assert"
import { clearItems, clearMobs } from "./clear"
import { expectGameStateConsistent, isIntegrityCheckEnabled } from "./integrity"

describe("clear", () => {
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

  it("clears mobs from every world tile", () => {
    const mob = RageBaitEntityFactory.getDefault()
    setPosition(mob, 1)
    game.state.world[1].mobs.push(mob)

    clearMobs(game)

    expect(game.state.world.every((tile) => tile.mobs.length === 0)).toBe(true)
  })

  describe("clearItems", () => {
    let backpack: Entity
    let mainHand: Entity
    let inventoryItem: Entity
    let equippedItem: Entity
    let nestedContainer: Entity
    let nestedItem: Entity

    beforeEach(() => {
      const player = getPlayer()
      backpack = assert(getBackpack(player), "Player has no backpack")
      mainHand = getEqSlotByType(player, MainHandSlotComponent)
      const groundItem = SwordEntityFactory.getDefault()
      inventoryItem = SwordEntityFactory.getDefault()
      equippedItem = SwordEntityFactory.getDefault()
      nestedContainer = ContainerEntityFactory.getDefault()
      nestedItem = HelmetEntityFactory.getDefault()

      setPosition(groundItem, 1)
      game.state.world[1].items.push(groundItem)
      addItemToEntityBackpack(player, inventoryItem)
      setContainerItemAt(mainHand, 1, equippedItem)
      addItemsToContainer(nestedContainer, nestedItem)
      addItemToEntityBackpack(player, nestedContainer)

      clearItems(game)
    })

    it("clears items from world tiles", () => {
      expect(game.state.world.every((tile) => tile.items.length === 0)).toBe(
        true,
      )
    })

    it("preserves items in inventory", () => {
      expect(getContainerItems(backpack)).toEqual(
        expect.arrayContaining([inventoryItem, nestedContainer]),
      )
    })

    it("preserves equipped items", () => {
      expect(getFirstContainerItem(mainHand)).toBe(equippedItem)
    })

    it("preserves items in other containers", () => {
      expect(getContainerItems(nestedContainer)).toContain(nestedItem)
    })
  })
})
