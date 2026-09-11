import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getEntityCreator,
  type Entity,
} from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { createGame, type Game } from "../../../game";
import {
  Hostility,
  HostilityComponent,
} from "../../model/components/ai/HostilityComponent";
import { NameComponent } from "../../model/components/display/NameComponent";
import { InspectDescComponent } from "../../model/components/interaction/InspectDescComponent";
import { InspectedComponent } from "../../model/components/interaction/InspectedComponent";
import { PositionComponent } from "../../model/components/spatial/PositionComponent";
import { RageBaitEntityFactory } from "../../model/entities/mobs/rageBait/RageBaitEntity";
import { dispatchGameAction } from "../actions/gameAction/dispatchGameAction";
import { resolveWorldAttackAction } from "../attack/resolveWorldAttackAction";
import { getInspectedTimes } from "../inspect/inspect";
import { InternalActionType } from "../internal/type";
import { getPlayer } from "../player/player";
import { setPosition } from "../position/position";
import { Direction } from "../turn/types";
import { WorldActionType } from "../world/types";
import { resolveWorldPokeAction } from "./resolveWorldPokeAction";

const TestMob = getEntityCreator("TEST_POKE_MOB");

const clearMobs = (game: Game): void => {
  game.state.world.forEach((tile) => {
    tile.mobs = [];
  });
};

const placeMob = (game: Game, mob: Entity, position: number): Entity => {
  setPosition(mob, position);
  game.state.world[position].mobs.push(mob);
  return mob;
};

const createTestMob = (game: Game, name: string, position: number): Entity => {
  const mob = TestMob();
  upsertComponents(
    mob,
    NameComponent({ name }),
    PositionComponent(),
    InspectedComponent(),
    InspectDescComponent({ text: "Looks testable" }),
  );
  return placeMob(game, mob, position);
};

describe("World Poke action", () => {
  let game: Game;

  beforeEach(() => {
    game = createGame();
    dispatchGameAction({ type: InternalActionType.INIT });
    clearMobs(game);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves through the game action map, inspects the target, and consumes a turn", () => {
    const player = getPlayer();
    const target = createTestMob(game, "Target", 1);
    const startingTurn = game.state.turn;

    dispatchGameAction({
      type: WorldActionType.POKE,
      sourceId: player.id,
      direction: Direction.RIGHT,
    });

    expect(getInspectedTimes(target)).toBe(1);
    expect(game.state.log).toContainEqual(
      expect.objectContaining({
        message: "You poked Target. Looks testable",
        action: expect.objectContaining({ type: WorldActionType.POKE }),
      }),
    );
    expect(game.state.turn).toBe(startingTurn + 1);
  });

  it("fails without consuming a turn when the adjacent tile is empty", () => {
    const resolution = resolveWorldPokeAction({
      type: WorldActionType.POKE,
      sourceId: getPlayer().id,
      direction: Direction.RIGHT,
    });

    expect(resolution.consumesTurn).toBe(false);
    expect(resolution.pendingLogs.map(({ message }) => message)).toEqual([
      "Nothing to poke",
    ]);
  });

  it("fails without consuming a turn at the world boundary", () => {
    const resolution = resolveWorldPokeAction({
      type: WorldActionType.POKE,
      sourceId: getPlayer().id,
      direction: Direction.LEFT,
    });

    expect(resolution.consumesTurn).toBe(false);
    expect(resolution.pendingLogs.map(({ message }) => message)).toEqual([
      "Nothing to poke",
    ]);
  });

  it("fails without consuming a turn when the source does not exist", () => {
    const resolution = resolveWorldPokeAction({
      type: WorldActionType.POKE,
      sourceId: -1,
      direction: Direction.RIGHT,
    });

    expect(resolution.consumesTurn).toBe(false);
    expect(resolution.pendingLogs.map(({ message }) => message)).toEqual([
      "Nothing to poke",
    ]);
  });

  it("allows a mob to poke and inspect the player", () => {
    const source = createTestMob(game, "Poker", 1);
    const player = getPlayer();

    const resolution = resolveWorldPokeAction({
      type: WorldActionType.POKE,
      sourceId: source.id,
      direction: Direction.LEFT,
    });

    expect(resolution.consumesTurn).toBe(true);
    expect(resolution.pendingLogs[0].message).toContain("Poker poked You");
    expect(getInspectedTimes(player)).toBe(1);
  });

  it("runs the target afterPoke hook after increasing its inspected count", () => {
    const rageBait = placeMob(game, RageBaitEntityFactory.getDefault(), 1);
    vi.spyOn(rageBait.rng, "chance").mockReturnValue(true); // todo: remove when runtime manuals are ready

    const resolution = resolveWorldPokeAction({
      type: WorldActionType.POKE,
      sourceId: getPlayer().id,
      direction: Direction.RIGHT,
    });

    expect(resolution.consumesTurn).toBe(true);
    expect(resolution.pendingLogs.map(({ message }) => message)).toEqual([
      "You poked Rage Bait. It looks cute.",
      "You enraged Rage Bait",
    ]);
    expect(getInspectedTimes(rageBait)).toBe(1);
    expect(getComponentByType(rageBait, HostilityComponent)?.hostility).toBe(
      Hostility.HOSTILE,
    );
  });

  it("queues World Poke with a direction for an unarmed world attacker", () => {
    const source = createTestMob(game, "Poker", 1);
    const player = getPlayer();

    const resolution = resolveWorldAttackAction({
      type: WorldActionType.ATTACK,
      sourceId: source.id,
      targetId: player.id,
    });

    expect(resolution.pendingActions).toHaveLength(1);
    expect(resolution.pendingActions[0].action).toEqual({
      type: WorldActionType.POKE,
      sourceId: source.id,
      direction: Direction.LEFT,
    });
  });
});
