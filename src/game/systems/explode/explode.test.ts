import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  EntityRole,
  getEntityCreator,
  type Entity,
} from "../../../core/model/Entity";
import { upsertComponents } from "../../../core/model/queries/components/add";
import { getComponentByType } from "../../../core/model/queries/components/get";
import { patchComponentByType } from "../../../core/model/queries/components/patch";
import { removeComponentsByType } from "../../../core/model/queries/components/remove";
import { upsertRoleEntities } from "../../../core/model/queries/entities/add";
import { createGame, type Game } from "../../../game";
import { ExplodeComponent } from "../../model/components/ExplodeComponent";
import { ExplodeRangeComponent } from "../../model/components/ExplodeRangeComponent";
import { NameComponent } from "../../model/components/display/NameComponent";
import { ExpComponent } from "../../model/components/mobs/ExpComponent";
import { HpComponent } from "../../model/components/mobs/HpComponent";
import { PositionComponent } from "../../model/components/PositionComponent";
import { ContainerEntityFactory } from "../../model/entities/items/container/ContainerEntity";
import { BoomerEntityFactory } from "../../model/entities/mobs/boomer/BoomerEntity";
import { getPosition } from "../../model/queries/position";
import type { GameState } from "../../state/state";
import { dispatchGameAction } from "../actions/gameAction/dispatchGameAction";
import { InternalActionType } from "../internal/type";
import { PlayerActionType } from "../player/types";
import { getDefaultTile } from "../world/tile";
import { WorldActionType, WorldKillActionReason } from "../world/types";

const ExplosiveEntity = getEntityCreator("TEST_EXPLOSIVE");
const TargetEntity = getEntityCreator("TEST_EXPLOSION_TARGET");

const placeMob = (state: GameState, mob: Entity, position: number): Entity => {
  if (!state.world[position]) {
    state.world[position] = getDefaultTile(position);
  }
  if (getComponentByType(mob, PositionComponent)) {
    patchComponentByType(mob, PositionComponent, (component) => {
      component.position = position;
    });
  } else {
    upsertComponents(mob, PositionComponent({ position }));
  }
  state.world[position].mobs.push(mob);
  return mob;
};

const createExplosiveEntity = (state: GameState, position = 10): Entity => {
  const explosive = ExplosiveEntity();
  upsertComponents(
    explosive,
    ExplodeComponent({ min: 4, max: 6 }),
    ExplodeRangeComponent({ range: 1 }),
    NameComponent({ name: "Explosive" }),
    ExpComponent({ exp: 0 }),
  );
  upsertRoleEntities(explosive, {
    [EntityRole.BACKPACK]: ContainerEntityFactory.getBackpack(),
  });
  return placeMob(state, explosive, position);
};

const createTargetEntity = (state: GameState, position: number): Entity => {
  const target = TargetEntity();
  upsertComponents(
    target,
    HpComponent({ hp: 100, maxHp: 100 }),
    NameComponent({ name: `Target ${position}` }),
  );
  return placeMob(state, target, position);
};

describe("Explode action cycle", () => {
  let game: Game;

  beforeEach(() => {
    game = createGame();
    dispatchGameAction({ type: InternalActionType.INIT });
  });

  it("runs the complete immediate cycle through dispatchGameAction", () => {
    const explosive = createExplosiveEntity(game.state);
    const targets = [8, 9, 10, 11, 12].map((position) =>
      createTargetEntity(game.state, position),
    );
    const range = vi
      .spyOn(explosive.rng, "range")
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(6);

    dispatchGameAction({
      type: WorldActionType.INIT_EXPLODE,
      entityId: explosive.id,
    });

    expect(getComponentByType(targets[0], HpComponent)?.hp).toBe(100);
    expect(getComponentByType(targets[1], HpComponent)?.hp).toBe(96);
    expect(getComponentByType(targets[2], HpComponent)?.hp).toBe(95);
    expect(getComponentByType(targets[3], HpComponent)?.hp).toBe(94);
    expect(getComponentByType(targets[4], HpComponent)?.hp).toBe(100);
    expect(range).toHaveBeenCalledTimes(3);
    expect(range).toHaveBeenNthCalledWith(1, 4, 6);
    expect(range).toHaveBeenNthCalledWith(2, 4, 6);
    expect(range).toHaveBeenNthCalledWith(3, 4, 6);
    expect(game.state.entityRegistryById[explosive.id]).toBeUndefined();
    expect(game.state.world[10].mobs).not.toContain(explosive);
    expect(game.state.timedActions).toEqual([]);
    expect(game.state.log).not.toContainEqual(
      expect.objectContaining({ message: "Explosive died" }),
    );
    expect(
      game.state.log.some(
        ({ action }) => action.type === WorldActionType.ATTACK,
      ),
    ).toBe(false);
  });

  it.each([
    ExplodeComponent,
    ExplodeRangeComponent,
  ])("does not start the cycle when %s is missing", (missing) => {
    const explosive = createExplosiveEntity(game.state);
    removeComponentsByType(explosive, missing.type);

    dispatchGameAction({
      type: WorldActionType.INIT_EXPLODE,
      entityId: explosive.id,
    });

    expect(game.state.timedActions).toEqual([]);
  });

  it("does not Kill an exploded entity outside tile.mobs", () => {
    const explosive = ExplosiveEntity();
    upsertComponents(
      explosive,
      ExplodeComponent({ min: 5, max: 5 }),
      ExplodeRangeComponent({ range: 1 }),
      PositionComponent({ position: 10 }),
      NameComponent({ name: "Explosive" }),
    );
    game.state.world[10] = getDefaultTile(10);

    dispatchGameAction({
      type: WorldActionType.INIT_EXPLODE,
      entityId: explosive.id,
    });

    expect(game.state.entityRegistryById[explosive.id]?.entity).toBe(explosive);
    expect(getComponentByType(explosive, ExplodeComponent)).toBeUndefined();
    expect(getComponentByType(explosive, ExplodeRangeComponent)).toBeUndefined();
  });

  it("logs death for an Attack Kill reason", () => {
    const explosive = createExplosiveEntity(game.state);

    dispatchGameAction({
      type: WorldActionType.KILL,
      entityId: explosive.id,
      position: 10,
      reason: WorldKillActionReason.ATTACK,
    });

    expect(game.state.log).toContainEqual(
      expect.objectContaining({ message: "Explosive died" }),
    );
  });

  it("does not recurse indefinitely when adjacent Boomers explode", () => {
    const left = placeMob(game.state, BoomerEntityFactory.getDefault(), 10);
    const right = placeMob(game.state, BoomerEntityFactory.getDefault(), 11);
    for (const boomer of [left, right]) {
      patchComponentByType(boomer, ExplodeComponent, (component) => {
        component.min = 5;
        component.max = 5;
      });
      patchComponentByType(boomer, ExplodeRangeComponent, (component) => {
        component.range = 1;
      });
    }

    expect(() => {
      dispatchGameAction({
        type: WorldActionType.INIT_EXPLODE,
        entityId: left.id,
      });
    }).not.toThrow();

    expect(game.state.entityRegistryById[left.id]).toBeUndefined();
    expect(game.state.entityRegistryById[right.id]).toBeUndefined();
  });

  it("ignores queued MobAi actions for Boomers removed earlier in the turn", () => {
    for (const tile of game.state.world) {
      if (tile) {
        tile.mobs.length = 0;
      }
    }
    const playerPosition = getPosition(game.state.player.player);
    const left = placeMob(
      game.state,
      BoomerEntityFactory.getDefault(),
      playerPosition + 1,
    );
    const right = placeMob(
      game.state,
      BoomerEntityFactory.getDefault(),
      playerPosition + 2,
    );
    for (const boomer of [left, right]) {
      patchComponentByType(boomer, ExplodeComponent, (component) => {
        component.min = 5;
        component.max = 5;
      });
    }

    expect(() => {
      dispatchGameAction({ type: PlayerActionType.WAIT });
    }).not.toThrow();

    expect(game.state.entityRegistryById[left.id]).toBeUndefined();
    expect(game.state.entityRegistryById[right.id]).toBeUndefined();
  });
});
