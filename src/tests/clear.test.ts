import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Entity } from "../core/model/Entity";
import { createGame, type Game } from "../game";
import { MainHandSlotComponent } from "../game/model/components/equipment/slots/MainHandSlotComponent";
import { SwordEntityFactory } from "../game/model/entities/items/SwordEntity";
import { ContainerEntityFactory } from "../game/model/entities/items/container/ContainerEntity";
import { HelmetEntityFactory } from "../game/model/entities/items/helmet/HelmetEntity";
import { RageBaitEntityFactory } from "../game/model/entities/mobs/rageBait/RageBaitEntity";
import {
  addItemToContainer,
  addItemToEntityBackpack,
  getBackpack,
  getContainerItems,
  getFirstContainerItem,
  setContainerItemAt,
} from "../game/systems/containers/containers";
import { getEqSlotByType } from "../game/systems/eq/eq";
import { InternalActionType } from "../game/systems/internal/type";
import { getPlayer } from "../game/systems/player/player";
import { setPosition } from "../game/systems/position/position";
import { assert } from "../utils/assert";
import { clearItems, clearMobs } from "./clear";
import {
  expectGameStateConsistent,
  integrityCheckEnabled,
} from "./integrity";

describe("world cleanup test helpers", () => {
  let game: Game;

  beforeEach(() => {
    game = createGame();
    game.dispatch({ type: InternalActionType.INIT });
    clearMobs(game);
    clearItems(game);
  });

  afterEach(() => {
    if (integrityCheckEnabled()) {
      expectGameStateConsistent(game);
    }

    vi.restoreAllMocks();
  });

  it("clears mobs from every world tile", () => {
    const mob = RageBaitEntityFactory.getDefault();
    setPosition(mob, 1);
    game.state.world[1].mobs.push(mob);

    clearMobs(game);

    expect(game.state.world.every((tile) => tile.mobs.length === 0)).toBe(true);
  });

  describe("clearItems", () => {
    let backpack: Entity;
    let mainHand: Entity;
    let inventoryItem: Entity;
    let equippedItem: Entity;
    let nestedContainer: Entity;
    let nestedItem: Entity;

    beforeEach(() => {
      const player = getPlayer();
      backpack = assert(getBackpack(player), "Player has no backpack");
      mainHand = getEqSlotByType(player, MainHandSlotComponent);
      const groundItem = SwordEntityFactory.getDefault();
      inventoryItem = SwordEntityFactory.getDefault();
      equippedItem = SwordEntityFactory.getDefault();
      nestedContainer = ContainerEntityFactory.getDefault();
      nestedItem = HelmetEntityFactory.getDefault();

      setPosition(groundItem, 1);
      game.state.world[1].items.push(groundItem);
      addItemToEntityBackpack(player, inventoryItem);
      setContainerItemAt(mainHand, 1, equippedItem);
      addItemToContainer(nestedContainer, nestedItem);
      addItemToEntityBackpack(player, nestedContainer);

      clearItems(game);
    });

    it("clears items from world tiles", () => {
      expect(game.state.world.every((tile) => tile.items.length === 0)).toBe(
        true,
      );
    });

    it("preserves items in inventory", () => {
      expect(getContainerItems(backpack)).toEqual(
        expect.arrayContaining([inventoryItem, nestedContainer]),
      );
    });

    it("preserves equipped items", () => {
      expect(getFirstContainerItem(mainHand)).toBe(equippedItem);
    });

    it("preserves items in other containers", () => {
      expect(getContainerItems(nestedContainer)).toContain(nestedItem);
    });
  });
});
