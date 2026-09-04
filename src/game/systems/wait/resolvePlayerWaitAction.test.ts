import { beforeEach, describe, expect, it, vi } from "vitest";
import { getEntityCreator } from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { getComponentsByType } from "../../../core/model/queries/components/get";
import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { createGame, type Game } from "../../../game";
import { NameComponent } from "../../model/components/display/NameComponent";
import { MainHandSlotComponent } from "../../model/components/eq/slots/MainHandSlotComponent";
import { OffhandSlotComponent } from "../../model/components/eq/slots/OffhandSlotComponent";
import { DefComponent } from "../../model/components/items/DefComponent";
import { DmgComponent } from "../../model/components/items/DmgComponent";
import { HostileComponent } from "../../model/components/mobs/HostileComponent";
import { HpComponent } from "../../model/components/mobs/HpComponent";
import { PositionComponent } from "../../model/components/PositionComponent";
import { getEqSlotByType, initEq } from "../../model/queries/eq";
import { getPlayer } from "../../model/queries/player";
import { dispatchGameAction } from "../actions/gameAction/dispatchGameAction";
import { setContainerItemAt } from "../containers/containers";
import { InternalActionType } from "../internal/type";
import { PlayerActionType } from "../player/types";
import { Direction } from "../turn/types";
import { resolveWorldBlockAction } from "../block/resolveWorldBlockAction";
import { resolveWorldCleanupBlockAction } from "../block/resolveWorldCleanupBlockAction";
import { resolveWorldInitBlockAction } from "../block/resolveWorldInitBlockAction";
import { WorldActionType } from "../world/types";
import { resolvePlayerWaitAction } from "./resolvePlayerWaitAction";

const TestItem = getEntityCreator("TEST_BLOCK_ITEM");
const TestAttacker = getEntityCreator("TEST_BLOCK_ATTACKER");

const clearMobs = (game: Game): void => {
  game.state.world.forEach((tile) => {
    tile.mobs = [];
  });
};

describe("wait and block", () => {
  let game: Game;

  beforeEach(() => {
    game = createGame();
    dispatchGameAction({ type: InternalActionType.INIT });
    clearMobs(game);
  });

  it("validates the target before init queues block", () => {
    expect(() =>
      resolveWorldInitBlockAction({
        type: WorldActionType.INIT_BLOCK,
        entityId: -1,
      }),
    ).toThrow("No entity to block");
  });

  it("adds a DefComponent using hand DEF and a 1 DEF fallback per held item", () => {
    const player = getPlayer();
    const mainHandItem = TestItem();
    const offhandItem = TestItem();
    upsertComponents(mainHandItem, DefComponent({ def: 3 }));
    setContainerItemAt(
      getEqSlotByType(player, MainHandSlotComponent),
      1,
      mainHandItem,
    );
    setContainerItemAt(
      getEqSlotByType(player, OffhandSlotComponent),
      1,
      offhandItem,
    );

    const resolution = resolveWorldInitBlockAction({
      type: WorldActionType.INIT_BLOCK,
      entityId: player.id,
    });

    expect(getComponentsByType(player, DefComponent)).toEqual([]);
    expect(resolution.pendingActions[0].action).toEqual({
      type: WorldActionType.BLOCK,
      entityId: player.id,
    });

    const blockResolution = resolveWorldBlockAction({
      type: WorldActionType.BLOCK,
      entityId: player.id,
    });
    const blockDef = getComponentsByType(player, DefComponent)[0];
    expect(blockDef.def).toBe(4);
    expect(blockResolution.pendingActions[0]).toEqual(
      expect.objectContaining({
        action: {
          type: WorldActionType.CLEANUP_BLOCK,
          defId: blockDef.id,
        },
        delay: 1,
      }),
    );

    resolveWorldCleanupBlockAction({
      type: WorldActionType.CLEANUP_BLOCK,
      defId: blockDef.id,
    });
    expect(getComponentsByType(player, DefComponent)).toEqual([]);
  });

  it("heals without queuing block out of combat", () => {
    const player = getPlayer();
    patchComponentByType(player, HpComponent, (hp) => {
      hp.hp = 10;
    });
    vi.spyOn(player.rng, "range").mockReturnValue(4);

    const resolution = resolvePlayerWaitAction({ type: PlayerActionType.WAIT });
    expect(resolution.pendingActions.map(({ action }) => action.type)).toEqual([
      WorldActionType.HEAL,
    ]);

    dispatchGameAction({ type: PlayerActionType.WAIT });

    expect(getComponentsByType(player, HpComponent)[0].hp).toBe(14);
    expect(getComponentsByType(player, DefComponent)).toEqual([]);
    expect(game.state.timedActions).toEqual([]);
    expect(game.state.log.at(-1)?.message).toBe("You wait");
  });

  it("does not heal in combat, logs block, and applies it for one world turn", () => {
    const player = getPlayer();
    const heldItem = TestItem();
    patchComponentByType(player, HpComponent, (hp) => {
      hp.hp = 10;
    });
    setContainerItemAt(
      getEqSlotByType(player, MainHandSlotComponent),
      1,
      heldItem,
    );

    const attacker = TestAttacker();
    const weapon = TestItem();
    upsertComponents(
      attacker,
      HostileComponent(),
      NameComponent({ name: "Attacker" }),
      PositionComponent({ position: 1 }),
    );
    upsertComponents(weapon, DmgComponent({ min: 5, max: 5 }));
    initEq(attacker);
    setContainerItemAt(
      getEqSlotByType(attacker, MainHandSlotComponent),
      1,
      weapon,
    );
    game.state.world[1].mobs.push(attacker);

    dispatchGameAction({ type: PlayerActionType.WAIT });

    expect(getComponentsByType(player, HpComponent)[0].hp).toBe(6);
    expect(getComponentsByType(player, DefComponent).map(({ def }) => def)).toEqual([
      1,
    ]);
    expect(game.state.log.some(({ message }) => message === "You block.")).toBe(
      true,
    );
    expect(
      game.state.log.some(({ action }) => action.type === WorldActionType.HEAL),
    ).toBe(false);

    clearMobs(game);
    dispatchGameAction({
      type: PlayerActionType.MOVE,
      direction: Direction.RIGHT,
    });

    expect(getComponentsByType(player, DefComponent)).toEqual([]);
  });
});
